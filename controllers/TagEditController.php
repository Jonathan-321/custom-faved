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
use Utils\TagData;
use function Framework\page;
use function Utils\getTagColors;
use function Utils\groupTagsByParent;

class TagEditController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$repository = ServiceContainer::get(Repository::class);
		$all_tags = $repository->getTags();

		$tag_id = $_GET['tag-id'] ?? null;

		if (empty($tag_id) || !isset($all_tags[$tag_id])) {
			throw new NotFoundException("Tag ID is not provided or does not exist");
		}
		$tag = $all_tags[$tag_id];

		$url_builder = ServiceContainer::get(UrlBuilder::class);

		$colors = getTagColors();

		$tags_by_parent = groupTagsByParent($all_tags);
		$tag_data = new TagData($tags_by_parent, $all_tags, [$tag_id]);
		$tags_option_list = $tag_data->build(0);

		$flash = FlashMessages::pull();
		$csrf_token = CSRFProtection::generateToken();

		return page('tag-edit', compact(
			'tag',
			'tag_id',
			'colors',
			'url_builder',
			'tags_option_list',
			'flash',
			'csrf_token'
		))->layout('primary');
	}
}
