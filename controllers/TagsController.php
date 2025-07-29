<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use Models\TagCreator;
use function Framework\data;

class TagsController implements ControllerInterface
{
	public function __invoke(): ResponseInterface
	{
		$repository = ServiceContainer::get(Repository::class);

		$tags = $repository->getTags();

		return data($tags);
	}
}