<?php

namespace Controllers;

use Config;
use Framework\Exceptions\DatabaseNotFound;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use Models\TagCreator;
use PDO;
use function Framework\redirect;

class SetupRunController
{
	public function __invoke(array $input): ResponseInterface
	{
		try {
			// Check if database already exists
			$repository = ServiceContainer::get(Repository::class);
			$db_exists = $repository->checkDatabaseExists();

		} catch (DatabaseNotFound $e) {
			$db_exists = false;
		}

		$url_builder = ServiceContainer::get(UrlBuilder::class);

		if ($db_exists) {
			FlashMessages::set('info', 'Database already exists');
			return redirect( $url_builder->build('/'));
		}

		$db_path = Config::getDBPath();
		$pdo = new PDO("sqlite:{$db_path}");
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$repository = new Repository($pdo);

		// Create database tables
		$result = $repository->setupDatabase();

		if (!$result) {
			FlashMessages::set('error', 'Failed to set up database');
			return redirect( $url_builder->build('/setup'));
		}

		/*
		 * Add demo content
		 */
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

		FlashMessages::set('success', 'Database setup completed successfully');
		return redirect( $url_builder->build('/'));
	}
}