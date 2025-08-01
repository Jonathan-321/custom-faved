<?php

namespace Controllers;


use Framework\ControllerInterface;
use Framework\Exceptions\DataWriteException;
use Framework\Exceptions\ValidationException;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use function Framework\redirect;

class ItemDeleteController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$repository = ServiceContainer::get(Repository::class);

		$item_id = $_GET['item-id'] ?? null;

		if (empty($item_id)) {
			throw new ValidationException('Item ID not provided');
		}

		$result = $repository->deleteItemTags($item_id);
		if (false === $result) {
			throw new DataWriteException("Error deleting item tags");
		}

		$result = $repository->deleteItem($item_id);
		if (false === $result) {
			throw new DataWriteException("Error deleting item");
		}

		FlashMessages::set('success', 'Item deleted successfully');

		$url_builder = ServiceContainer::get(UrlBuilder::class);
		$return_url = (isset($_GET['return'])) ? urldecode($_GET['return']) : $url_builder->build('/');
		return redirect($return_url);
	}
}
