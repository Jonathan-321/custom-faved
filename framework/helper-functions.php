<?php

namespace Framework;


use Exception;
use Framework\Responses\PageResponse;
use Framework\Responses\RedirectResponse;
use Framework\Responses\DataResponse;
use Models\Repository;
use Models\TagCreator;

function page($page_name, $data)
{
	return new PageResponse($page_name, $data);
}

function redirect($location, $code = 303)
{
	return new RedirectResponse($location, $code);
}

function data(array $data) {
	return new DataResponse($data);
}


function buildItemTagsFromInput(string $input_tags)
{
	$repository = ServiceContainer::get(Repository::class);
	$tag_creator = ServiceContainer::get(TagCreator::class);

	$tags = $repository->getTags();

	$input_tags = explode(',', $input_tags);
	$exising_tag_ids = array_intersect($input_tags, array_keys($tags));
	$new_tags = array_diff($input_tags, $exising_tag_ids);

	$tag_id_by_title = array_column($tags, 'id', 'title');
	$new_tag_ids = array_map(function ($tag_name) use ($tag_creator, &$tag_id_by_title) {
		$tag_segments = explode('/', $tag_name);
		$tag_segments = array_map('trim', $tag_segments);

		$parent = 0;
		foreach ($tag_segments as $segment) {
			if (isset($tag_id_by_title[$segment])) {
				$parent = $tag_id_by_title[$segment];
				continue;
			}
			$parent = $tag_creator->createTag($segment, '', $parent);
			$tag_id_by_title[$segment] = $parent;
		}
		return $parent;
	}, $new_tags);

	return array_merge($exising_tag_ids, $new_tag_ids);
}

function flattenArray(array $array, string $prefix = ''): array
{
	$result = [];

	foreach ($array as $key => $value) {
		$new_key = $prefix === '' ? $key : $prefix . $key;

		if (is_array($value)) {
			$result += flattenArray($value, $new_key); // Recursive call
		} else {
			$result[$new_key] = $value;
		}
	}

	return $result;
}

function validatePasswordAndConfirmation(string $password, string $confirm_password)
{
	$password = trim($password);

	if (empty($password)) {
		throw new Exception('New password cannot be empty');
	}

	if (!is_string($password) || strlen($password) < 6) {
		throw new Exception('Password must be at least 6 characters long');
	}

	$confirm_password = trim($confirm_password);

	if (empty($confirm_password)) {
		throw new Exception('Password confirmation cannot be empty');
	}

	if ($password !== $confirm_password) {
		throw new Exception('Password confirmation does not match the new password');
	}
}

function validateUsername(string $username)
{
	$username = trim($username);

	if (empty($username)) {
		throw new Exception('Username cannot be empty');
	}

	if (!is_string($username) || !preg_match('/^[a-zA-Z0-9_]+$/', $username)) {
		throw new Exception('Username format is invalid. Please use alphanumeric characters and underscores.');
	}
}

function loginUser(int $user_id): void
{
	if (!isset($_SESSION)) {
		session_start();
	}

	$_SESSION['user_id'] = $user_id;
}

function logoutUser(): void
{
	if (!isset($_SESSION)) {
		return;
	}

	$_SESSION['user_id'] = null;
}

function getLoggedInUser()
{
	if (!isset($_SESSION['user_id'])) {
		return null;
	}

	$repository = ServiceContainer::get(Repository::class);
	return $repository->getUser($_SESSION['user_id']);
}

function getHTTPProtocol()
{
	if ((isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === 'on' || $_SERVER['HTTPS'] === 1))
		|| (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')) {
		return 'https://';
	}
	return 'http://';
}