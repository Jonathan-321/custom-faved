<?php

namespace Controllers;


use Framework\ControllerInterface;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use Models\TagCreator;
use function Framework\page;
use function Framework\redirect;

class ItemCreateUpdateController implements ControllerInterface
{
	public function __invoke(array $input) : ResponseInterface
	{
		$repository = ServiceContainer::get(Repository::class);
		$url_builder = ServiceContainer::get(UrlBuilder::class);

		$item_id = $_GET['item-id'] ?? null;
		$title = $_POST['title'];
		$description = $_POST['description'];
		$url = $_POST['url'];
		$comments = $_POST['comments'];
		$image = $_POST['image'];

		$tag_creator = ServiceContainer::get(TagCreator::class);

		$task = $_POST['task'];

		if ($item_id && $task !== 'save-as-copy') {
			$repository->updateItem($title, $description, $url, $comments, $image, $item_id);
		} else {
			$item_id = $repository->createItem($title, $description, $url, $comments, $image);
		}

		$item_tag_ids = [];

		if ($_POST['tags']) {
			$tags = $repository->getTags();

			$input_tags = explode(',', $_POST['tags']);
			$exising_tag_ids = array_intersect($input_tags, array_keys($tags));
			$new_tags = array_diff($input_tags, $exising_tag_ids);

			$tag_id_by_title = array_column($tags, 'id', 'title');
			$new_tag_ids = array_map(function ($tag_name) use ($tag_creator, &$tag_id_by_title) {
				$tag_segments = explode('/', $tag_name);
				$tag_segments = array_map('trim', $tag_segments);

				$parent = 0;
				foreach ($tag_segments as $segment) {
					if (isset($tag_id_by_title[$segment])) {
						$parent = $tag_id_by_title[$segment];
						continue;
					}
					$parent = $tag_creator->createTag($segment, '', $parent);
					$tag_id_by_title[$segment] = $parent;
				}
				return $parent;
			}, $new_tags);

			$item_tag_ids = array_merge($exising_tag_ids, $new_tag_ids);
		}

		$repository->updateItemTags($item_tag_ids, $item_id);

		switch ($task) {
			case 'save':
			case 'save-as-copy':
				FlashMessages::set('success', 'Item saved successfully');
				$redirect_url = $url_builder->build('/item', ['item-id' => $item_id]);
				$response = redirect($redirect_url);
				break;
			case 'save-back':
				FlashMessages::set('success', 'Item saved successfully');
				$redirect_url = $_POST['return'] ?? $url_builder->build('/');
				$response = redirect( $redirect_url);
				break;
			case 'save-new':
				FlashMessages::set('success', 'Item saved successfully');
				$redirect_url = $url_builder->build('/item');
				$response = redirect( $redirect_url);
				break;
			case 'save-close':
				$response = page('saved-close', [])->layout('primary');
				break;
		}
		return $response;
	}
}
