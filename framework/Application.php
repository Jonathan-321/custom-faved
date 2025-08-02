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
	public function __construct(protected array $routes, protected array $middleware_classes)
	{
	}

	public function run($route, $method)
	{
		$expects_json = str_contains($_SERVER['HTTP_ACCEPT'] ?? '' . $_SERVER['CONTENT_TYPE'] ?? '', 'application/json');
		$url_builder = ServiceContainer::get(UrlBuilder::class);

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

		} catch (DatabaseNotFound $e) {
			$response = redirect($url_builder->build('/setup'));
		} catch (ValidationException|DataWriteException $e) {
			FlashMessages::set('error', $e->getMessage());
			$referrer = $_SERVER['HTTP_REFERER'] ?? $url_builder->build('/');
			$response = redirect($referrer);
		} catch (UnauthorizedException $e) {
			if ($expects_json) {
				$response = data(['error' => $e->getMessage()], $e->getCode());
			} else {
				$response = redirect($url_builder->build('/login'));
			}
		} catch (ForbiddenException $e) {
			http_response_code(403);
			$response = page('error', ['message' => "403 - {$e->getMessage()}"])
				->layout('primary');
		} catch (NotFoundException $e) {
			http_response_code(404);
			$response = page('error', ['message' => "404 - {$e->getMessage()}"])
				->layout('primary');
		} catch (Exception $e) {
			http_response_code(500);
			$response = page('error', ['message' => "500 - {$e->getMessage()}"])
				->layout('primary');
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
			throw new Exception('Invalid JSON input',400);
		}
		return $input;
	}
}

