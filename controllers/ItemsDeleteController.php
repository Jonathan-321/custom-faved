<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\data;

class ItemsDeleteController implements ControllerInterface
{
	public function __invoke() : ResponseInterface
	{
		if (empty($_GET['item-id'])) {
			return data([
				'success' => false,
				'message' => 'Item ID is required',
			], 400);
		}

		$item_id = $_GET['item-id'];

		$repository = ServiceContainer::get(Repository::class);;

		$result = $repository->deleteItemTags($item_id);

		if (false === $result) {
			return data([
				'success' => false,
				'message' => 'Error deleting item tags',
				'data' => [
					'item_id' => $item_id,
				]
			], 500);
		}

		$result = $repository->deleteItem($item_id);

		if (false === $result) {
			return data([
				'success' => false,
				'message' => 'Error deleting item',
				'data' => [
					'item_id' => $item_id,
				]
			], 500);
		}

		return data([
			'success' => true,
			'message' => 'Item deleted successfully',
			'data' => [
				'item_id' => $item_id,
			]
		]);
	}
}