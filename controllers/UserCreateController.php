<?php

namespace Controllers;

use Config;
use Exception;
use Framework\ControllerInterface;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\data;
use function Framework\loginUser;
use function Framework\validatePasswordAndConfirmation;
use function Framework\validateUsername;

class UserCreateController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		// Check if authentication is enabled (any user exists)
		$repository = ServiceContainer::get(Repository::class);
		$auth_enabled = $repository->userTableNotEmpty();

		// If auth is enabled already and user exists, raise an error
		if ($auth_enabled) {
			return data([
				'success' => false,
				'message' => 'User has been created already.'
			], 400);
		}

		try {
			$username = trim($input['username'] ?? '');
			validateUsername($username);

			$password = $input['password'] ?? '';
			$confirm_password = $input['confirm_password'] ?? '';
			validatePasswordAndConfirmation(
				$password,
				$confirm_password
			);
		} catch (Exception $e) {
			return data([
				'success' => false,
				'message' => $e->getMessage(),
			], 422);
		}

		$password_hash = password_hash($password, Config::getPasswordAlgo());
		$user_id = $repository->createUser($username, $password_hash);

		if (!$user_id) {
			return data([
				'success' => false,
				'message' => 'Failed to create user.',
			], 500);
		}

		loginUser($user_id);

		return data([
			'success' => true,
			'message' => 'User created successfully.',
		], 200);
	}
}
