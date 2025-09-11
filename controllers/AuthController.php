<?php

namespace Controllers;

use Config;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\data;
use function Framework\loginUser;

class AuthController
{
	public function __invoke(array $input): ResponseInterface
	{
		// Check if authentication is enabled (any users exist)
		$repository = ServiceContainer::get(Repository::class);
		$auth_enabled = $repository->userTableNotEmpty();

		if (!$auth_enabled) {
			return data([
				'success' => false,
				'message' => 'Authentication is disabled. Please set up a user account first.',
			], 400);
		}

		// Validate form submission
		$username = trim($input['username'] ?? '');
		$password = $input['password'] ?? '';

		if (empty($username) || empty($password)) {
			return data([
				'success' => false,
				'message' => 'Username and password are required.',
			], 422);
		}

		// Find user
		$repository = ServiceContainer::get(Repository::class);
		$user = $repository->getUserByUsername($username);

		if (!$user || !password_verify($password, $user['password_hash'])) {
			return data([
				'success' => false,
				'message' => 'Invalid username or password.',
			], 422);
		}

		// Rehash password if needed
		if (password_needs_rehash($user['password_hash'], Config::getPasswordAlgo())) {
			$new_hash = password_hash($password, Config::getPasswordAlgo());
			$repository->updateUserPassword($user['id'], $new_hash);
		}

		// Update user session
		loginUser($user['id']);

		return data([
			'success' => true,
			'message' => 'Sign in successful.',
		], 200);
	}
}