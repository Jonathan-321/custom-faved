<?php

use Controllers\AuthController;
use Controllers\ItemCreateUpdateController;
use Controllers\ItemDeleteController;
use Controllers\ItemEditController;
use Controllers\ItemsController;
use Controllers\ItemsCreateController;
use Controllers\ItemsDeleteController;
use Controllers\ItemsGetController;
use Controllers\ItemsUpdateController;
use Controllers\LoginSubmitController;
use Controllers\LoginViewController;
use Controllers\LogoutSubmitController;
use Controllers\PocketImportRunController;
use Controllers\PocketImportViewController;
use Controllers\SettingsAuthDisableController;
use Controllers\SettingsAuthViewController;
use Controllers\SettingsBookmarkletViewController;
use Controllers\SettingsPasswordUpdateController;
use Controllers\SettingsUserCreateController;
use Controllers\SettingsUsernameUpdateController;
use Controllers\SetupRunController;
use Controllers\SetupViewController;
use Controllers\TagDeleteController;
use Controllers\TagEditController;
use Controllers\TagsController;
use Controllers\TagUpdateController;
use Controllers\UserCreateController;
use Controllers\UserDeleteController;
use Controllers\UserGetController;
use Controllers\UserPasswordUpdateController;
use Controllers\UserUsernameUpdateController;

return [
	'/' => [
		'GET' => ItemsController::class
	],
	'/login' => [
		'GET' => LoginViewController::class,
		'POST' => LoginSubmitController::class
	],
	'/logout' => [
		'POST' => LogoutSubmitController::class
	],
	'/setup' => [
		'GET' => SetupViewController::class,
		'POST' => SetupRunController::class
	],
	'/tag' => [
		'GET' => TagEditController::class,
		'POST' => TagUpdateController::class,
		'DELETE' => TagDeleteController::class,
	],
	'/item' => [
		'GET' => ItemEditController::class,
		'POST' => ItemCreateUpdateController::class,
		'DELETE' => ItemDeleteController::class,
	],
	'/pocket-import' => [
		'GET' => PocketImportViewController::class,
		'POST' => PocketImportRunController::class,
	],
	'/settings/auth' => [
		'GET' => SettingsAuthViewController::class,
	],
	'/settings/bookmarklet' => [
		'GET' => SettingsBookmarkletViewController::class,
	],
	'/settings/username' => [
		'POST' => SettingsUsernameUpdateController::class,
		'PATCH' => UserUsernameUpdateController::class,
		'OPTIONS' => ItemsGetController::class, // For CORS preflight requests, temporary solution
	],
	'/settings/password' => [
		'POST' => SettingsPasswordUpdateController::class,
		'PATCH' => UserPasswordUpdateController::class,
		'OPTIONS' => ItemsGetController::class, // For CORS preflight requests, temporary solution
	],
	'/settings/create-user' => [
		'POST' => SettingsUserCreateController::class,
	],
	'/settings/delete-user' => [
		'POST' => SettingsAuthDisableController::class,
	],

	// Data routes
	'/items' => [
		'GET' => ItemsGetController::class,
		'POST' => ItemsCreateController::class,
		'PATCH' => ItemsUpdateController::class,
		'DELETE' => ItemsDeleteController::class,
		'OPTIONS' => ItemsGetController::class, // For CORS preflight requests, temporary solution
	],
	'/tags' => [
		'GET' => TagsController::class,
	],
	'/settings/user' => [
		'GET' => UserGetController::class,
		'POST' => UserCreateController::class,
		'DELETE' => UserDeleteController::class,
		'OPTIONS' => ItemsGetController::class, // For CORS preflight requests, temporary solution
	],
	'/auth' => [
		'POST' => AuthController::class,
		'OPTIONS' => ItemsGetController::class, // For CORS preflight requests, temporary solution
	],
];
