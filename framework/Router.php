<?php

namespace Framework;

use Framework\Exceptions\NotFoundException;

class Router
{
	protected $routes;

	public function __construct(array $routes)
	{
		$this->routes = $routes;

	}

	public function match_controller(string $path, string $method): string
	{
		$routes = flattenRoutesArray($this->routes);
		$route_id = $path . '/' . $method;
		if (!isset($routes[$route_id])) {
			throw new NotFoundException("Route $method $path not found");
		}

		return $routes[$route_id];
	}
}


