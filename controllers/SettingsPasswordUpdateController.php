<?php

namespace Controllers;

use Config;
use Exception;
use Framework\ControllerInterface;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use function Framework\getLoggedInUser;
use function Framework\redirect;
use function Framework\validatePasswordAndConfirmation;

class SettingsPasswordUpdateController implements ControllerInterface
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

			$password = $_POST['password'] ?? '';
			$confirm_password = $_POST['confirm_password'] ?? '';
			validatePasswordAndConfirmation(
				$password,
				$confirm_password
			);

		} catch (Exception $e) {
			FlashMessages::set('error', $e->getMessage());
			return redirect($url_builder->build('/settings/auth'));
		}

		$password_hash = password_hash($_POST['password'], Config::getPasswordAlgo());

		$repository = ServiceContainer::get(Repository::class);
		$result = $repository->updatePasswordHash($user['id'], $password_hash);

		if ($result) {
			FlashMessages::set('success', 'Password updated successfully');
		} else {
			FlashMessages::set('error', 'Failed to update password');
		}

		return redirect($url_builder->build('/settings/auth'));
	}
}