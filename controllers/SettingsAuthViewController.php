<?php

namespace Controllers;


use Framework\ControllerInterface;
use Framework\CSRFProtection;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use function Framework\getLoggedInUser;
use function Framework\page;

class SettingsAuthViewController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$user = getLoggedInUser();

		$url_builder = ServiceContainer::get(UrlBuilder::class);

		return page('settings-auth', [
			'url_builder' => $url_builder,
			'csrf_token' => CSRFProtection::generateToken(),
			'flash' => FlashMessages::pull(),
			'user' => $user,
		])->layout('settings', [
			'url_builder' => $url_builder,
			'active_tab' => 'auth',
		])->layout('primary');
	}
}
