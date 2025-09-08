<?php
require_once ROOT_DIR . '/utils/util-functions.php';
require_once ROOT_DIR . '/utils/PocketImporter.php';
require_once ROOT_DIR . '/models/TagCreator.php';
require_once ROOT_DIR . '/models/Repository.php';

use Framework\Exceptions\DatabaseNotFound;
use Framework\ServiceContainer;
use Models\TagCreator;

// Bind DB services
ServiceContainer::bind(PDO::class, function () {
	$db_path = Config::getDBPath();
	if (!file_exists($db_path)) {
		throw new DatabaseNotFound();
	}

	if (!is_writable($db_path)) {
		throw new Exception("Database file not writable: {$db_path}");
	}

	$pdo = new PDO("sqlite:{$db_path}");
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $pdo;
});

ServiceContainer::bind(Models\Repository::class, function () {
	$pdo = ServiceContainer::get(PDO::class);
	$repository = new Models\Repository($pdo);
	return $repository;
});

ServiceContainer::bind(TagCreator::class, function () {
	$pdo = ServiceContainer::get(PDO::class);
	$url_builder = new TagCreator($pdo);
	return $url_builder;
});