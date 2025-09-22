<?php

use Controllers\AuthController;
use Controllers\AuthLogoutController;
use Controllers\ImportPocketController;
use Controllers\ImportBookmarksController;
use Controllers\ItemsCreateController;
use Controllers\ItemsDeleteController;
use Controllers\ItemsGetController;
use Controllers\ItemsUpdateController;
use Controllers\UserUsernameUpdateController;
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
	'api' => [
		'items' => [
			'GET' => ItemsGetController::class,
			'POST' => ItemsCreateController::class,
			'PATCH' => ItemsUpdateController::class,
			'DELETE' => ItemsDeleteController::class,
		],
		'tags' => [
			'/' => [
				'GET' => TagsController::class,
				'POST' => TagsCreateController::class,
				'DELETE' => TagsDeleteController::class,
			],
			'update-pinned' => [
				'PATCH' => TagsUpdatePinnedController::class,
			],
			'update-title' => [
				'PATCH' => TagsUpdateTitleController::class,
			],
			'update-color' => [
				'PATCH' => TagsUpdateColorController::class,
			],
		],
		'settings' => [
			'user' => [
				'GET' => UserGetController::class,
				'POST' => UserCreateController::class,
				'DELETE' => UserDeleteController::class,
			],
			'username' => [
				'PATCH' => UserUsernameUpdateController::class,
			],
			'password' => [
				'PATCH' => UserPasswordUpdateController::class,
			],
		],
		'auth' => [
			'/' => [
				'POST' => AuthController::class,
			],
			'logout' => [
				'POST' => AuthLogoutController::class
			],
		],
		'setup' => [
			'database' => [
				'POST' => SetupDatabaseController::class
			],
		],
		'import' => [
			'pocket' => [
				'POST' => ImportPocketController::class,
			],
			'bookmarks' => [
				'POST' => ImportBookmarksController::class,
			],
		],
	]
];
