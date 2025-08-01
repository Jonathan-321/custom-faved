<?php

namespace Controllers;

use Config;
use Exception;
use Framework\ControllerInterface;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\data;
use function Framework\getLoggedInUser;
use function Framework\validatePasswordAndConfirmation;

class UserPasswordUpdateController implements ControllerInterface
{

	public function __invoke(array $input): ResponseInterface
	{
		// Check if authentication is enabled (any user exists)
		$repository = ServiceContainer::get(Repository::class);
		$auth_enabled = $repository->userTableNotEmpty();

		if (!$auth_enabled) {
			return data([
				'success' => false,
				'message' => 'Authentication is disabled. Please set up a user account first.',
			], 400);
		}

		$user = getLoggedInUser();

		try {
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
		$result = $repository->updatePasswordHash($user['id'], $password_hash);

		if (!$result) {
			return data([
				'success' => false,
				'message' => 'Failed to update password.',
			], 500);
		}

		return data([
			'success' => true,
			'message' => 'Password updated successfully.',
		], 200);
	}
}