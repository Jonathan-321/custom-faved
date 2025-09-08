<?php

use Controllers\AuthController;
use Controllers\AuthLogoutController;
use Controllers\ImportPocketController;
use Controllers\ItemsCreateController;
use Controllers\ItemsDeleteController;
use Controllers\ItemsGetController;
use Controllers\ItemsUpdateController;
use Controllers\SettingsUsernameUpdateController;
use Controllers\TagsController;
use Controllers\TagsCreateController;
use Controllers\TagsDeleteController;
use Controllers\TagsUpdateColorController;
use Controllers\TagsUpdatePinnedController;
use Controllers\TagsUpdateTitleController;
use Controllers\UserCreateController;
use Controllers\UserDeleteController;
use Controllers\UserGetController;
use Controllers\UserPasswordUpdateController;
use Controllers\SetupDatabaseController;

return [
	'/items' => [
		'GET' => ItemsGetController::class,
		'POST' => ItemsCreateController::class,
		'PATCH' => ItemsUpdateController::class,
		'DELETE' => ItemsDeleteController::class,
	],
	'/tags' => [
		'GET' => TagsController::class,
		'POST' => TagsCreateController::class,
		'DELETE' => TagsDeleteController::class,
	],
	'/tags/update-pinned' => [
		'PATCH' => TagsUpdatePinnedController::class,
	],
	'/tags/update-title' => [
		'PATCH' => TagsUpdateTitleController::class,
	],
	'/tags/update-color' => [
		'PATCH' => TagsUpdateColorController::class,
	],
	'/settings/user' => [
		'GET' => UserGetController::class,
		'POST' => UserCreateController::class,
		'DELETE' => UserDeleteController::class,
	],
	'/settings/username' => [
		'POST' => SettingsUsernameUpdateController::class,
	],
	'/settings/password' => [
		'PATCH' => UserPasswordUpdateController::class,
	],
	'/auth' => [
		'POST' => AuthController::class,
	],
	'/auth/logout' => [
		'POST' => AuthLogoutController::class
	],
	'/setup/database' => [
		'POST' => SetupDatabaseController::class
	],
	'/import/pocket' => [
		'POST' => ImportPocketController::class,
	],
];
