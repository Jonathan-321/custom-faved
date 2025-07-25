<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\data;

class ItemsGetController implements ControllerInterface
{
	public function __invoke(): ResponseInterface
	{

		$repository = ServiceContainer::get(Repository::class);
		$all_items = $repository->getItems();

		$data = array_values($all_items);

		return data($data);
	}
}