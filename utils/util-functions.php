<?php

namespace Utils;

use Framework\ServiceContainer;
use Models\Repository;
use Models\TagCreator;

function groupTagsByParent($tags)
{
	$tags_by_parent = [];
	foreach ($tags as $tag_id => $tag) {
		$tags_by_parent[$tag['parent']][] = $tag_id;
	}
	return $tags_by_parent;
}


function getPinnedTags($tags)
{
	$tags = array_filter($tags, function ($tag) {
		return !empty($tag['pinned']);
	});
	return array_column($tags, 'id');
}

function getTagColors()
{
	return [
		'gray' => 'secondary',
		'green' => 'success',
		'red' => 'danger',
		'yellow' => 'warning',
		'aqua' => 'info',
		'white ' => 'light',
		'black' => 'dark',
	];
}

function extractTagSegments(string $title): array
{
	$segments = explode('/', $title);
	$segments = array_map('trim', $segments);
	$segments = array_filter($segments, function ($segment) {
		return '' !== $segment;
	});
	return $segments;
}

	function createTagsFromSegments(array $tag_segments): int
{
	$repository = ServiceContainer::get(Repository::class);
	$tags = $repository->getTags();
	$tag_creator = ServiceContainer::get(TagCreator::class);

	$parent_tag_id = 0;
	$check_existing_parent = true;
	foreach ($tag_segments as $tag_title) {
		$existing_parent = array_find($tags, function ($tag) use ($tag_title, $parent_tag_id) {
			return $tag['title'] === $tag_title && $tag['parent'] === $parent_tag_id;
		});

		if ($check_existing_parent && $existing_parent) {
			$parent_tag_id = $existing_parent['id'];
			continue;
		}

		$parent_tag_id = $tag_creator->createTag($tag_title, '', $parent_tag_id);
		$check_existing_parent = false;
	}

	return (int)$parent_tag_id;
}

function findURLMatches($checked_url, $items, &$host_matches)
{
	$domain = parse_url($checked_url)['host'];
	if (preg_match('/(?P<domain>[a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i', $domain, $matches)) {
		$domain = $matches['domain'];
	}


	$url_matches = [];
	$host_matches = [];
	foreach ($items as $item) {
		if ($item['url'] === $checked_url) {
			$url_matches[] = $item;
		} elseif (str_contains($item['url'], $domain)) {
			$host_matches[] = $item;
		}
	}
	return $url_matches;
}
