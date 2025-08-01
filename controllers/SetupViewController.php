<?php

namespace Controllers;

use Config;
use Framework\ControllerInterface;
use Framework\CSRFProtection;
use Framework\Exceptions\DatabaseNotFound;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use function Framework\page;
use function Framework\redirect;

class SetupViewController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		try {
			// Check if database already exists
			$repository = ServiceContainer::get(Repository::class);
			$db_exists = $repository->checkDatabaseExists();

		} catch (DatabaseNotFound $e) {
			$db_exists = false;
		}

		$url_builder = ServiceContainer::get(UrlBuilder::class);

		if ($db_exists) {
			FlashMessages::set('info', 'Database already exists');
			return redirect($url_builder->build('/'));
		}

		return page('setup', [
			'db_file' => str_replace(ROOT_DIR, '', Config::getDBPath()),
			'url_builder' => $url_builder,
			'csrf_token' => CSRFProtection::generateToken(),
			'flash' => FlashMessages::pull(),
		])->layout('primary');
	}
}
