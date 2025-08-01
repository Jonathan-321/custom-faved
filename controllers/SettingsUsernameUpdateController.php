<?php

namespace Controllers;

use Exception;
use Framework\ControllerInterface;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use function Framework\getLoggedInUser;
use function Framework\redirect;
use function Framework\validateUsername;

class SettingsUsernameUpdateController implements ControllerInterface
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

		try {
			$username = trim($_POST['username'] ?? '');

			validateUsername($username);

		} catch (Exception $e) {
			FlashMessages::set('error', $e->getMessage());
			return redirect($url_builder->build('/settings/auth'));
		}

		// Update username
		$repository = ServiceContainer::get(Repository::class);
		$result = $repository->updateUsername($user['id'], $username);

		if ($result) {
			FlashMessages::set('success', 'Username updated successfully');
		} else {
			FlashMessages::set('error', 'Failed to update username');
		}

		return redirect($url_builder->build('/settings/auth'));
	}
}