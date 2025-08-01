<?php

namespace Controllers;

use Config;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use function Framework\loginUser;
use function Framework\redirect;

class LoginSubmitController
{
	public function __invoke(array $input): ResponseInterface
	{
		$url_builder = ServiceContainer::get(UrlBuilder::class);

		// Check if authentication is enabled (any users exist)
		$repository = ServiceContainer::get(Repository::class);
		$auth_enabled = $repository->userTableNotEmpty();

		// If auth is disabled, redirect to the setup page
		if (!$auth_enabled) {
			FlashMessages::set('info', 'Authentication is disabled. Please set up a user account first.');
			return redirect($url_builder->build('/settings/auth'));
		}

		// Validate form submission
		$username = trim($_POST['username'] ?? '');
		$password = $_POST['password'] ?? '';

		if (empty($username) || empty($password)) {
			FlashMessages::set('error', 'Username and password are required');
			return redirect($url_builder->build('/login'));
		}

		// Find user
		$repository = ServiceContainer::get(Repository::class);
		$user = $repository->getUserByUsername($username);

		if (!$user || !password_verify($password, $user['password_hash'])) {
			// Failed login
			FlashMessages::set('error', 'Invalid username or password');
			return redirect($url_builder->build('/login'));
		}

		if (password_needs_rehash($user['password_hash'], Config::getPasswordAlgo())) {
			// Rehash password if needed
			$new_hash = password_hash($password, Config::getPasswordAlgo());
			$repository->updateUserPassword($user['id'], $new_hash);
		}

		// Set user session and redirect to homepage
		loginUser($user['id']);
		FlashMessages::set('success', 'Login successful');
		return redirect($url_builder->build('/'));
	}
}