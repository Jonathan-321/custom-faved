<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\buildItemTagsFromInput;
use function Framework\data;

class ItemsCreateController implements ControllerInterface
{
	public function __invoke() : ResponseInterface
	{
		$repository = ServiceContainer::get(Repository::class);

		$rawData = file_get_contents("php://input");
		$input = json_decode($rawData, true);

		if (json_last_error() !== JSON_ERROR_NONE) {
			return data([
				'success' => false,
				'message' => 'Invalid JSON input',
			], 400);
		}

		$title = $input['title'];
		$description = $input['description'];
		$url = $input['url'];
		$comments = $input['comments'];
		$image = $input['image'];

		$item_id = $repository->createItem($title, $description, $url, $comments, $image);

		$item_tag_ids = [];

		if (!empty($input['tags'])) {
			$item_tag_ids = buildItemTagsFromInput($input['tags']);
		}

		$repository->updateItemTags($item_tag_ids, $item_id);

		return data([
			'success' => true,
			'message' => 'Item created successfully',
			'data' => [
				'item_id' => $item_id,
			]
		]);
	}
}