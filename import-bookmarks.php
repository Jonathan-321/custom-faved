#!/usr/bin/env php
<?php

/**
 * Bookmark Auto-Importer for Faved
 * Imports bookmarks from Chrome and Safari browsers
 */

define('ROOT_DIR', __DIR__);
require_once __DIR__ . '/framework/bootstrap.php';

use Models\Repository;
use Utils\BookmarkImporter;
use Models\TagCreator;
use Framework\ServiceContainer;

// ANSI colors for output
define('GREEN', "\033[0;32m");
define('YELLOW', "\033[0;33m");
define('RED', "\033[0;31m");
define('NC', "\033[0m"); // No Color

class BookmarkAutoImporter
{
	private Repository $repository;
	private BookmarkImporter $importer;
	private TagCreator $tagCreator;
	private array $existingUrls = [];
	private int $imported = 0;
	private int $skipped = 0;
	private int $duplicates = 0;

	public function __construct()
	{
		try {
			$pdo = ServiceContainer::get(PDO::class);
		} catch (\Exception $e) {
			// Database might not exist, create it directly
			$dbPath = $_ENV['ROOT_DIR'] . '/storage/faved.db';
			if (!file_exists($dbPath)) {
				echo YELLOW . "Database not found, creating new one...\n" . NC;
				touch($dbPath);
			}
			$pdo = new PDO("sqlite:$dbPath");
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		
		$this->repository = new Repository($pdo);
		$this->tagCreator = new TagCreator($pdo);
		$this->importer = new BookmarkImporter($this->repository, $this->tagCreator);
		
		// Load existing URLs to avoid duplicates
		$this->loadExistingUrls();
	}

	private function loadExistingUrls(): void
	{
		$items = $this->repository->getItems();
		foreach ($items as $item) {
			$this->existingUrls[$item['url']] = true;
		}
		echo YELLOW . "Found " . count($this->existingUrls) . " existing bookmarks in Faved\n" . NC;
	}

	public function importChrome(): void
	{
		echo GREEN . "\n=== Importing Chrome Bookmarks ===\n" . NC;
		
		$chromeDir = $_SERVER['HOME'] . '/Library/Application Support/Google/Chrome';
		$profiles = glob($chromeDir . '/*/Bookmarks');
		
		foreach ($profiles as $bookmarkFile) {
			$profileName = basename(dirname($bookmarkFile));
			echo "\nProcessing Chrome $profileName...\n";
			$this->importChromeBookmarks($bookmarkFile, $profileName);
		}
	}

	private function importChromeBookmarks(string $file, string $profileName): void
	{
		if (!file_exists($file)) {
			echo RED . "File not found: $file\n" . NC;
			return;
		}

		$json = file_get_contents($file);
		$data = json_decode($json, true);
		
		if (!$data || !isset($data['roots'])) {
			echo RED . "Invalid bookmark file format\n" . NC;
			return;
		}

		// Process bookmark bar and other folders
		foreach ($data['roots'] as $rootName => $root) {
			if (is_array($root) && isset($root['children'])) {
				$this->processChromeFolder($root, "Chrome $profileName", $rootName);
			}
		}
	}

	private function processChromeFolder(array $folder, string $parentTag = '', string $folderName = ''): void
	{
		if (!isset($folder['children'])) {
			return;
		}

		$currentTag = $parentTag;
		if ($folderName && $folderName !== 'bookmark_bar') {
			$currentTag .= '/' . $folderName;
		}

		foreach ($folder['children'] as $item) {
			if ($item['type'] === 'url') {
				$this->importBookmark([
					'url' => $item['url'],
					'title' => $item['name'],
					'created_at' => $this->chromeTimestampToDate($item['date_added'] ?? null),
					'tags' => [$currentTag]
				]);
			} elseif ($item['type'] === 'folder') {
				$this->processChromeFolder($item, $currentTag, $item['name']);
			}
		}
	}

	private function chromeTimestampToDate($timestamp): ?string
	{
		if (!$timestamp) return null;
		// Chrome uses microseconds since 1601-01-01
		$seconds = ($timestamp / 1000000) - 11644473600;
		return date('Y-m-d H:i:s', $seconds);
	}

	public function importSafari(): void
	{
		echo GREEN . "\n=== Importing Safari Bookmarks ===\n" . NC;
		
		$safariFile = $_SERVER['HOME'] . '/Library/Safari/Bookmarks.plist';
		if (!file_exists($safariFile)) {
			echo YELLOW . "Safari bookmarks not found\n" . NC;
			return;
		}

		// Convert plist to XML
		$xml = shell_exec("plutil -convert xml1 -o - '$safariFile'");
		if (!$xml) {
			echo RED . "Failed to read Safari bookmarks\n" . NC;
			return;
		}

		// For now, we'll export Safari bookmarks to HTML first
		echo YELLOW . "Safari import requires HTML export. Please:\n";
		echo "1. Open Safari\n";
		echo "2. File → Export → Bookmarks\n";
		echo "3. Save as 'safari-bookmarks.html'\n";
		echo "4. Run: php import-bookmarks.php safari-bookmarks.html\n" . NC;
	}

	private function importBookmark(array $bookmark): void
	{
		// Skip if duplicate
		if (isset($this->existingUrls[$bookmark['url']])) {
			$this->duplicates++;
			echo ".";
			return;
		}

		// Skip invalid URLs
		if (!filter_var($bookmark['url'], FILTER_VALIDATE_URL)) {
			$this->skipped++;
			return;
		}

		try {
			// Create item
			$itemId = $this->repository->createItem(
				$bookmark['title'] ?? parse_url($bookmark['url'], PHP_URL_HOST),
				'', // description
				$bookmark['url'],
				'', // comments
				'', // image
				$bookmark['created_at']
			);

			// Add tags
			if (!empty($bookmark['tags'])) {
				foreach ($bookmark['tags'] as $tagPath) {
					$tagId = $this->tagCreator->createFromPath($tagPath);
					if ($tagId) {
						$this->repository->attachItemTags([$tagId], $itemId);
					}
				}
			}

			$this->imported++;
			$this->existingUrls[$bookmark['url']] = true;
			echo GREEN . "+" . NC;
		} catch (Exception $e) {
			$this->skipped++;
			echo RED . "x" . NC;
		}
	}

	public function importHtmlFile(string $file): void
	{
		echo GREEN . "\n=== Importing HTML Bookmarks ===\n" . NC;
		
		if (!file_exists($file)) {
			echo RED . "File not found: $file\n" . NC;
			return;
		}

		$content = file_get_contents($file);
		$skippedCount = 0;
		$imported = $this->importer->processHTML($content, $skippedCount);
		
		echo GREEN . "\nImported $imported bookmarks\n" . NC;
		if ($skippedCount > 0) {
			echo YELLOW . "Skipped $skippedCount items\n" . NC;
		}
	}

	public function showSummary(): void
	{
		echo "\n" . GREEN . "=== Import Summary ===" . NC . "\n";
		echo "Imported: " . GREEN . $this->imported . NC . " new bookmarks\n";
		echo "Duplicates: " . YELLOW . $this->duplicates . NC . " (skipped)\n";
		echo "Invalid/Skipped: " . RED . $this->skipped . NC . "\n";
		echo "Total in Faved: " . (count($this->existingUrls)) . " bookmarks\n";
	}
}

// Main execution
$importer = new BookmarkAutoImporter();

if ($argc > 1 && file_exists($argv[1])) {
	// Import specific HTML file
	$importer->importHtmlFile($argv[1]);
} else {
	// Auto-import from browsers
	$importer->importChrome();
	$importer->importSafari();
}

$importer->showSummary();

echo "\n✅ Done!\n";