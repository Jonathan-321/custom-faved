<?php

namespace Framework\Middleware;

abstract class MiddlewareAbstract
{
	public function __construct(protected ?MiddlewareAbstract $next, protected string $route, string $method)
	{
	}

	abstract public function handle();
}