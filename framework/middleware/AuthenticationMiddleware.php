<?php

namespace Framework\Middleware;

use Controllers\AuthController;
use Framework\Exceptions\DatabaseNotFound;
use Framework\Exceptions\UnauthorizedException;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\getLoggedInUser;

class AuthenticationMiddleware extends MiddlewareAbstract
{
	public function handle()
	{
		$controller_class = $this->controller_class;

		// Skip authentication for login route
		if ($controller_class === AuthController::class) {
			return $this->next && $this->next->handle();
		}

		// If the database is not set up yet, skip authentication checks
		try {
			$repository = ServiceContainer::get(Repository::class);
		} catch (DatabaseNotFound $e) {
			return $this->next && $this->next->handle();
		}

		if (!$repository->checkDatabaseExists()) {
			return $this->next && $this->next->handle();
		}

		$auth_enabled = $repository->userTableNotEmpty();

		// If auth is disabled, skip authentication check
		if (!$auth_enabled) {
			return $this->next && $this->next->handle();
		}

		$user = getLoggedInUser();

		if ($user) {
			return $this->next && $this->next->handle();
		}

		throw new UnauthorizedException();
	}
}