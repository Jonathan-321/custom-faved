<?php

namespace Controllers;


use Framework\ControllerInterface;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use function Framework\page;

class SettingsBookmarkletViewController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$url_builder = ServiceContainer::get(UrlBuilder::class);

		return page('settings-bookmarklet', [
		])->layout('settings', [
			'url_builder' => $url_builder,
			'active_tab' => 'bookmarklet',
		])->layout('primary');
	}
}
