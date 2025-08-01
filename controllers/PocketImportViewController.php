<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\CSRFProtection;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use function Framework\page;

class PocketImportViewController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$url_builder = ServiceContainer::get(UrlBuilder::class);
		$flash = FlashMessages::pull();
		$csrf_token = CSRFProtection::generateToken();

		return page('pocket-import', compact('url_builder', 'flash', 'csrf_token'))
			->layout('primary');

	}
}
