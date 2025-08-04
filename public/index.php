<?php


//if (empty($_SERVER['DB_NAME'])) {
//	$cookie_name = 'faved_db_name';
//	$db_name = $_COOKIE[$cookie_name] ?? null;
//	if (! $db_name) {
//		function generate_secure_random_string($length = 64) {
//			$bytes = random_bytes($length / 2);
//			return bin2hex($bytes);
//		}
//		$db_name = generate_secure_random_string();
//		setcookie($cookie_name, $db_name, time() + 3600 * 24 * 365, '/', '', isset($_SERVER['HTTPS']), true);
//	}
//	header("Location: /db{$db_name}/index.php?route=/");
//	exit();
//}

const ROOT_DIR = __DIR__ . '/..';
require_once ROOT_DIR . '/framework/bootstrap.php';
