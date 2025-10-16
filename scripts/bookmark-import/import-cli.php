#!/usr/bin/env php
<?php

/**
 * Standalone Bookmark Importer for Faved
 */

define('ROOT_DIR', __DIR__);

// Direct includes without framework
require_once ROOT_DIR . '/Config.php';
require_once ROOT_DIR . '/models/Repository.php';
require_once ROOT_DIR . '/models/TagCreator.php';
require_once ROOT_DIR . '/utils/BookmarkImporter.php';
require_once ROOT_DIR . '/utils/util-functions.php';

// ANSI colors
define('GREEN', "\033[0;32m");
define('YELLOW', "\033[0;33m");
define('RED', "\033[0;31m");
define('NC', "\033[0m");

// Get database connection
function getDB() {
	$db_path = Config::getDBPath();
	if (!file_exists($db_path)) {
		echo RED . "Error: Database not found. Please visit the web interface first to create it.\n" . NC;
		exit(1);
	}
	
	$pdo = new PDO("sqlite:{$db_path}");
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $pdo;
}

class SimpleImporter {
	private $pdo;
	private $existingUrls = [];
	private $imported = 0;
	private $duplicates = 0;
	private $errors = 0;
	
	public function __construct() {
		$this->pdo = getDB();
		$this->loadExistingUrls();
	}
	
	private function loadExistingUrls() {
		$stmt = $this->pdo->query('SELECT url FROM items');
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$this->existingUrls[$row['url']] = true;
		}
		echo YELLOW . "Found " . count($this->existingUrls) . " existing bookmarks\n" . NC;
	}
	
	public function importChrome() {
		echo GREEN . "\n=== Importing Chrome Bookmarks ===\n" . NC;
		
		$chromeDir = $_SERVER['HOME'] . '/Library/Application Support/Google/Chrome';
		$profiles = glob($chromeDir . '/*/Bookmarks');
		
		if (empty($profiles)) {
			echo YELLOW . "No Chrome profiles found\n" . NC;
			return;
		}
		
		foreach ($profiles as $bookmarkFile) {
			$profileName = basename(dirname($bookmarkFile));
			echo "\nProcessing Chrome $profileName...\n";
			
			$json = file_get_contents($bookmarkFile);
			$data = json_decode($json, true);
			
			if (!$data || !isset($data['roots'])) {
				echo RED . "Invalid bookmark file\n" . NC;
				continue;
			}
			
			// Process bookmark folders
			foreach ($data['roots'] as $rootName => $root) {
				if (isset($root['children']) && is_array($root['children'])) {
					$this->processBookmarks($root['children']);
				}
			}
		}
	}
	
	private function processBookmarks($items, $depth = 0) {
		foreach ($items as $item) {
			if ($item['type'] === 'url') {
				// Skip if duplicate
				if (isset($this->existingUrls[$item['url']])) {
					$this->duplicates++;
					echo ".";
					continue;
				}
				
				// Skip javascript: URLs
				if (strpos($item['url'], 'javascript:') === 0) {
					continue;
				}
				
				try {
					// Insert bookmark
					$stmt = $this->pdo->prepare(
						'INSERT INTO items (title, url, description, comments, image, created_at) 
						VALUES (:title, :url, "", "", "", datetime("now"))'
					);
					
					$stmt->execute([
						':title' => $item['name'],
						':url' => $item['url']
					]);
					
					$this->imported++;
					$this->existingUrls[$item['url']] = true;
					echo GREEN . "+" . NC;
					
				} catch (Exception $e) {
					$this->errors++;
					echo RED . "x" . NC;
				}
				
			} elseif ($item['type'] === 'folder' && isset($item['children'])) {
				// Recursively process folders
				$this->processBookmarks($item['children'], $depth + 1);
			}
		}
	}
	
	public function showSummary() {
		echo "\n\n" . GREEN . "=== Import Summary ===" . NC . "\n";
		echo "✅ Imported: " . GREEN . $this->imported . NC . " new bookmarks\n";
		echo "⚠️  Duplicates: " . YELLOW . $this->duplicates . NC . " (skipped)\n";
		if ($this->errors > 0) {
			echo "❌ Errors: " . RED . $this->errors . NC . "\n";
		}
		echo "\nTotal bookmarks in Faved: " . count($this->existingUrls) . "\n";
	}
}

// Run the import
echo "🚀 Faved Bookmark Importer\n";
echo "========================\n";

$importer = new SimpleImporter();
$importer->importChrome();
$importer->showSummary();

echo "\n✅ Done! Visit http://localhost:5173 to see your bookmarks.\n";