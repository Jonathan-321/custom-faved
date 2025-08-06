<?php

namespace Framework;


use Exception;
use Framework\Exceptions\DatabaseNotFound;
use Framework\Exceptions\DataWriteException;
use Framework\Exceptions\UnauthorizedException;
use Framework\Exceptions\ForbiddenException;
use Framework\Exceptions\NotFoundException;
use Framework\Exceptions\ValidationException;

class Application
{
	public function __construct(protected array $routes, protected array $middleware_classes, protected array $error_redirects)
	{
	}

	public function run($route, $method)
	{
		$expects_json = str_contains(($_SERVER['HTTP_ACCEPT'] ?? '') . ($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json');

		try {
			foreach (array_reverse($this->middleware_classes) as $middleware_class) {
				$middleware = new $middleware_class($middleware ?? null);
			}
			isset($middleware) && $middleware->handle();

			$router = new Router($this->routes);
			$controller_class = $router->match_controller($route, $method);

			$input = $this->getInput();

			$controller = new $controller_class();
			$response = $controller($input);

		} catch (\Exception $e) {
			if ($expects_json) {
				$response = data([
					'success' => false,
					'message' => $e->getMessage(),
					'error' => $e->getMessage(),
				], $e->getCode());
			} elseif(isset($this->error_redirects[get_class($e)])) {
				FlashMessages::set('error', $e->getMessage());
				$redirect_url = $this->error_redirects[get_class($e)];
				$response = redirect($redirect_url);
			} else {
				http_response_code($e->getCode());
				$response = page('error', ['message' => $e->getMessage()])
					->layout('primary');
			}
		}

		$response->yield();
	}

	public function getInput() : array
	{
		$content_type = $_SERVER['CONTENT_TYPE'] ?? '';
		if (! str_contains($content_type, 'application/json') ) {
			return array_merge($_POST, $_GET, $_FILES);
		}

		$raw_data = file_get_contents("php://input");

		if ('' === $raw_data) {
			return [];
		}
		$input = json_decode($raw_data, true);

		if (json_last_error() !== JSON_ERROR_NONE) {
			// @TODO: Make proper exception
			throw new ValidationException('Invalid JSON input',400);
		}
		return $input;
	}
}

