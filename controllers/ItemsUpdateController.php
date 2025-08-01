<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\buildItemTagsFromInput;
use function Framework\data;

class ItemsUpdateController implements ControllerInterface
{
	public function __invoke(array $input) : ResponseInterface
	{
		if (empty($_GET['item-id'])) {
			return data([
				'success' => false,
				'message' => 'Item ID is required',
			], 400);
		}

		$item_id = $_GET['item-id'];

		$repository = ServiceContainer::get(Repository::class);

		$title = $input['title'];
		$description = $input['description'];
		$url = $input['url'];
		$comments = $input['comments'];
		$image = $input['image'];

		$repository->updateItem($title, $description, $url, $comments, $image, $item_id);

		$item_tag_ids = [];

		if (!empty($input['tags'])) {
			$item_tag_ids = buildItemTagsFromInput($input['tags']);
		}

		$repository->updateItemTags($item_tag_ids, $item_id);

		return data([
			'success' => true,
			'message' => 'Item updated successfully',
			'data' => [
				'item_id' => $item_id,
			]
		]);
	}
}