#!/usr/bin/env php
<?php

/**
 * Local Bookmark Importer - Runs on your Mac and pushes to Faved API
 */

// ANSI colors
define('GREEN', "\033[0;32m");
define('YELLOW', "\033[0;33m");
define('RED', "\033[0;31m");
define('NC', "\033[0m");

class LocalBookmarkImporter {
	private $apiBase = 'http://localhost:8000/api';
	private $imported = 0;
	private $duplicates = 0;
	private $errors = 0;
	private $existingUrls = [];
	
	public function __construct() {
		// Check if Faved is running
		if (!$this->checkConnection()) {
			echo RED . "Error: Cannot connect to Faved. Make sure containers are running.\n" . NC;
			exit(1);
		}
		$this->loadExistingBookmarks();
	}
	
	private function checkConnection() {
		$ch = curl_init($this->apiBase . '/items');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, 5);
		$response = curl_exec($ch);
		$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		return $code === 200;
	}
	
	private function loadExistingBookmarks() {
		$ch = curl_init($this->apiBase . '/items');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($ch);
		$data = json_decode($response, true);
		
		if (isset($data['data']['items'])) {
			foreach ($data['data']['items'] as $item) {
				$this->existingUrls[$item['url']] = true;
			}
		}
		echo YELLOW . "Found " . count($this->existingUrls) . " existing bookmarks in Faved\n" . NC;
	}
	
	public function importChrome() {
		echo GREEN . "\n=== Importing Chrome Bookmarks ===\n" . NC;
		
		$chromeDir = $_ENV['HOME'] . '/Library/Application Support/Google/Chrome';
		$profiles = glob($chromeDir . '/*/Bookmarks');
		
		if (empty($profiles)) {
			echo YELLOW . "No Chrome profiles found\n" . NC;
			return;
		}
		
		foreach ($profiles as $bookmarkFile) {
			$profileName = basename(dirname($bookmarkFile));
			$fileSize = filesize($bookmarkFile);
			echo "\nProcessing Chrome $profileName (" . round($fileSize/1024) . " KB)...\n";
			
			$json = file_get_contents($bookmarkFile);
			$data = json_decode($json, true);
			
			if (!$data || !isset($data['roots'])) {
				echo RED . "Invalid bookmark file\n" . NC;
				continue;
			}
			
			// Count total bookmarks
			$totalUrls = $this->countUrls($data['roots']);
			echo "Found $totalUrls bookmarks in this profile\n";
			
			// Process all bookmark roots
			foreach ($data['roots'] as $rootName => $root) {
				if (isset($root['children']) && is_array($root['children'])) {
					echo "Processing $rootName...\n";
					$this->processBookmarks($root['children'], ["Chrome-$profileName"]);
				}
			}
		}
	}
	
	private function countUrls($node) {
		$count = 0;
		if (is_array($node)) {
			foreach ($node as $item) {
				if (isset($item['type']) && $item['type'] === 'url') {
					$count++;
				} elseif (isset($item['children'])) {
					$count += $this->countUrls($item['children']);
				}
			}
		}
		return $count;
	}
	
	private function processBookmarks($items, $tags = []) {
		foreach ($items as $item) {
			if ($item['type'] === 'url') {
				// Skip if duplicate
				if (isset($this->existingUrls[$item['url']])) {
					$this->duplicates++;
					echo ".";
					if ($this->duplicates % 50 === 0) echo " ($this->duplicates dupes)\n";
					continue;
				}
				
				// Skip javascript: URLs
				if (strpos($item['url'], 'javascript:') === 0) {
					continue;
				}
				
				// Create bookmark via API
				$this->createBookmark($item, $tags);
				
			} elseif ($item['type'] === 'folder' && isset($item['children'])) {
				// Add folder name to tags and recurse
				$folderTags = array_merge($tags, [$item['name']]);
				$this->processBookmarks($item['children'], $folderTags);
			}
		}
	}
	
	private function createBookmark($item, $tags) {
		$postData = [
			'title' => $item['name'],
			'url' => $item['url'],
			'description' => '',
			'comments' => '',
			'image' => '',
			'tags' => []
		];
		
		$ch = curl_init($this->apiBase . '/items');
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
		$response = curl_exec($ch);
		$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		
		if ($code === 200 || $code === 201) {
			$this->imported++;
			$this->existingUrls[$item['url']] = true;
			echo GREEN . "+" . NC;
			if ($this->imported % 50 === 0) echo " ($this->imported imported)\n";
		} else {
			$this->errors++;
			echo RED . "x" . NC;
		}
	}
	
	public function showSummary() {
		echo "\n\n" . GREEN . "=== Import Summary ===" . NC . "\n";
		echo "✅ Imported: " . GREEN . $this->imported . NC . " new bookmarks\n";
		echo "⚠️  Duplicates: " . YELLOW . $this->duplicates . NC . " (skipped)\n";
		if ($this->errors > 0) {
			echo "❌ Errors: " . RED . $this->errors . NC . "\n";
		}
		echo "\nTotal bookmarks in Faved: " . (count($this->existingUrls)) . "\n";
	}
}

// Check if PHP is available
if (!function_exists('curl_init')) {
	echo RED . "Error: PHP curl extension is required\n" . NC;
	echo "Install with: brew install php\n";
	exit(1);
}

// Run the import
echo "🚀 Faved Local Bookmark Importer\n";
echo "================================\n";

$importer = new LocalBookmarkImporter();
$importer->importChrome();
$importer->showSummary();

echo "\n✅ Done! Visit http://localhost:5173 to see your bookmarks.\n";