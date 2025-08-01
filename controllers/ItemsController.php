<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\CSRFProtection;
use Framework\Exceptions\NotFoundException;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use Utils\TagList;
use Utils\TagRenderer;
use function Framework\getLoggedInUser;
use function Framework\page;
use function Utils\getPinnedTags;
use function Utils\getTagColors;
use function Utils\groupTagsByParent;

class ItemsController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$selected_tag = $_GET['tag'] ?? null;

		$repository = ServiceContainer::get(Repository::class);
		$all_tags = $repository->getTags();

		if (null !== $selected_tag && (!isset($all_tags[$selected_tag]) && $selected_tag !== 'notag')) {
			throw new NotFoundException("Tag with ID $selected_tag does not exist");
		}

		$all_items = $repository->getItems();

		$url_builder = ServiceContainer::get(UrlBuilder::class);

		if (null === $selected_tag) {
			$items = $all_items;
		} elseif ('notag' === $selected_tag) {
			$items = array_filter($all_items, function ($item) {
				return empty($item['tags']);
			});
		} else {
			$items = array_filter($all_items, function ($item) use ($selected_tag) {
				return in_array($selected_tag, $item['tags']);
			});
		}

		$pinned_tags = getPinnedTags($all_tags);

		$tags_by_parent = groupTagsByParent($all_tags);
		$tag_list = new TagList($tags_by_parent, $all_tags, $selected_tag, []);
		$pinned_tags_output = $tag_list->render($pinned_tags);
		$tag_list = new TagList($tags_by_parent, $all_tags, $selected_tag, $pinned_tags);
		$unpinned_tags_output = $tag_list->render($tags_by_parent[0] ?? []);

		$colors = getTagColors();
		$tag_renderer = new TagRenderer($all_tags, $selected_tag, $colors);

		$flash = FlashMessages::pull();

		$csrf_token = CSRFProtection::generateToken();

		$user = getLoggedInUser();

		return page('items', compact(
			'url_builder',
			'items',
			'tag_renderer',
			'pinned_tags_output',
			'unpinned_tags_output',
			'flash',
			'selected_tag',
			'csrf_token',
			'user',
		))->layout('primary');
	}
}
