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
			return strtolower($tag['title']) === strtolower($tag_title) && $tag['parent'] === $parent_tag_id;
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

function createWelcomeContent($repository)
{
	$tag_creator = ServiceContainer::get(TagCreator::class);
	$faved_tag_id = $tag_creator->createTag('Faved', 'This is a tag for Faved links. Feel free to delete it after getting familiar with those resources.', 0, 'gray', true);
	$welcome_tag_id = $tag_creator->createTag('Welcome', "Familiarize yourself with the functionality of Faved by exploring the articles under this tag.\n\nℹ️ This is a nested tag. Nested tags are perfect for grouping several projects, e.g. for Work, School, or Personal use. \n\n💡 To create a nested tag, simply separate words with a forward slash.", $faved_tag_id, 'green', false);

	$item_id = $repository->createItem(
		'Faved - Organize Your Bookmarks',
		'A self-hosted, open-source solution to store, categorize, and access your bookmarks from anywhere.',
		'https://faved.dev/',
		'Faved main site',
		'https://faved.dev/static/images/bookmark-thumb.png',
		null
	);
	$repository->attachItemTags([$faved_tag_id], $item_id);

	$item_id = $repository->createItem(
		'Faved Demo',
		'Try out Faved online before installing it on your machine. Demo sites are provided for testing and are deleted after one month.',
		'https://demo.faved.dev/',
		'',
		'',
		null
	);
	$repository->attachItemTags([$faved_tag_id]
		, $item_id);

	$item_id = $repository->createItem(
		'Blog | Faved - Organize Your Bookmarks',
		'Faved updates, tutorials and product announcements',
		'https://faved.dev/blog',
		'',
		'',
		null
	);
	$repository->attachItemTags([$faved_tag_id], $item_id);

	$item_id = $repository->createItem(
		'GitHub - denho/faved: Free open-source bookmark manager with customisable nested tags. Super fast and lightweight. All data is stored locally.',
		'Free open-source bookmark manager with customisable nested tags. Super fast and lightweight. All data is stored locally. - denho/faved',
		'https://github.com/denho/faved',
		'',
		'',
		null
	);
	$repository->attachItemTags([$faved_tag_id]
		, $item_id);

	$item_id = $repository->createItem(
		'Faved on Twitter / X (@FavedTool)',
		'Lightning fast free open source bookmark manager with accent on privacy and data ownership.',
		'https://x.com/FavedTool',
		'',
		'',
		null
	);
	$repository->attachItemTags([$faved_tag_id], $item_id);

	$item_id = $repository->createItem(
		'Meet Faved: An Open-Source Privacy-First Bookmark Manager | Faved - Organize Your Bookmarks',
		'In a world where every digital service wants to control your data, I believe it’s important to have an option to keep your data secure from trackers and advertising networks. That’s why I built Faved: an open-source, self-hosted bookmark manager that gives you complete control over your saved web content and links.',
		'https://faved.dev/blog/meet-faved-open-source-privacy-first-bookmark-manager',
		'',
		'',
		null
	);
	$repository->attachItemTags([$welcome_tag_id], $item_id);

	$item_id = $repository->createItem(
		'How to Migrate Your Data from Pocket to Faved | Faved - Organize Your Bookmarks',
		'Pocket is shutting down on July 8, 2025. As a privacy-first alternative, Faved lets you organize and manage your bookmarks while keeping full ownership of your data. Learn how to migrate your data from Pocket to Faved in a few simple steps.',
		'https://faved.dev/blog/migrate-pocket-to-faved',
		'',
		'',
		null
	);
	$repository->attachItemTags([$welcome_tag_id], $item_id);
}
