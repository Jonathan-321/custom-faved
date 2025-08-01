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
use function Framework\loginUser;
use function Framework\redirect;
use function Framework\validatePasswordAndConfirmation;
use function Framework\validateUsername;

class SettingsUserCreateController implements ControllerInterface
{

	public function __invoke(array $input): ResponseInterface
	{
		$url_builder = ServiceContainer::get(UrlBuilder::class);

		// Check if authentication is enabled (any user exists)
		$repository = ServiceContainer::get(Repository::class);
		$auth_enabled = $repository->userTableNotEmpty();

		// If auth is enabled already and user exists, raise an error
		if ($auth_enabled) {
			FlashMessages::set('info', 'User has been created already.');
			return redirect($url_builder->build('/settings/auth'));
		}

		try {
			$username = trim($_POST['username'] ?? '');
			validateUsername($username);

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

		$repository = ServiceContainer::get(Repository::class);
		$password_hash = password_hash($password, Config::getPasswordAlgo());
		$user_id = $repository->createUser($username, $password_hash);

		if ($user_id) {
			loginUser($user_id);
			FlashMessages::set('success', 'User created successfully.');
		} else {
			FlashMessages::set('error', 'Failed to create user.');
		}

		return redirect($url_builder->build('/settings/auth'));
	}
}