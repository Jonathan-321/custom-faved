<?php

namespace Controllers;

use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use function Framework\getLoggedInUser;
use function Framework\logoutUser;
use function Framework\redirect;

class SettingsAuthDisableController
{
	public function __invoke(array $input): ResponseInterface
	{
		$url_builder = ServiceContainer::get(UrlBuilder::class);

		// Check if authentication is enabled (any user exists)
		$repository = ServiceContainer::get(Repository::class);
		$auth_enabled = $repository->userTableNotEmpty();

		// If auth is disabled, redirect to the setup page
		if (!$auth_enabled) {
			FlashMessages::set('info', 'Authentication is disabled. Please set up a user account first.');
			return redirect($url_builder->build('/settings/auth'));
		}

		$user = getLoggedInUser();

		$repository = ServiceContainer::get(Repository::class);
		$result = $repository->deleteUser($user['id']);

		// Assume we have a User model to handle the update
		if ($result) {
			logoutUser();
			FlashMessages::set('success', 'Authentication disabled');
		} else {
			FlashMessages::set('error', 'Failed to disable authentication');
		}

		$url_builder = ServiceContainer::get(UrlBuilder::class);
		return redirect($url_builder->build('/settings/auth'));
	}
}