<?php

namespace Framework;
class UrlBuilder
{
	private $base_url;

	public function __construct($base_url = '')
	{
		$this->base_url = $base_url;
	}

	public function build($route, array $params = [])
	{
		$url = $this->base_url . $route;

		if (!empty($params)) {
			$url .= '?' . http_build_query($params);
		}

		return $url;
	}
}
