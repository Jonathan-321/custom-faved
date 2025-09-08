<?php

namespace Framework\Middleware;

use Framework\CSRFProtection;
use Framework\Exceptions\ForbiddenException;

class CSRFMiddleware extends MiddlewareAbstract
{
	public function handle()
	{
		// Skip CSRF check for GET requests
		if ($this->method === 'GET') {
			return $this->next && $this->next->handle();
		}

		// Verify CSRF token
		$token = $_POST['csrf_token'] ?? '';

		if (!CSRFProtection::verifyToken($token)) {
			throw new ForbiddenException('CSRF token validation failed', 403);
		}

		return $this->next && $this->next->handle();
	}
}
