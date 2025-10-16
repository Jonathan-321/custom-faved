<?php

namespace Models;

class TagCreator
{
	private $pdo;
	private $stmt;

	public function __construct(\PDO $pdo)
	{
		$this->pdo = $pdo;
		$this->stmt = $pdo->prepare(
			'INSERT INTO tags (title, description, color, parent, pinned, created_at) 
			VALUES (:title, :description, :color, :parent, :pinned, :created_at)'
		);
	}

	public function createTag(string $tag_title, string $tag_description, int $tag_parent, $color = 'gray', bool $pinned = false)
	{
		$this->stmt->execute([
			':title' => $tag_title,
			':description' => $tag_description,
			':color' => $color,
			':parent' => $tag_parent,
			':pinned' => (int) $pinned,
			':created_at' => date('Y-m-d H:i:s')
		]);

		return $this->pdo->lastInsertId();
	}

	public function createFromPath(string $path): int
	{
		$segments = explode('/', $path);
		$segments = array_filter($segments, fn($s) => trim($s) !== '');
		
		if (empty($segments)) {
			return 0;
		}

		$repository = new Repository($this->pdo);
		$tags = $repository->getTags();
		
		$parentId = 0;
		$lastTagId = 0;
		
		foreach ($segments as $segment) {
			$segment = trim($segment);
			$found = false;
			
			// Look for existing tag with this title and parent
			foreach ($tags as $tag) {
				if ($tag['title'] === $segment && $tag['parent'] == $parentId) {
					$parentId = $tag['id'];
					$lastTagId = $tag['id'];
					$found = true;
					break;
				}
			}
			
			// Create new tag if not found
			if (!$found) {
				$newTagId = $this->createTag($segment, '', $parentId);
				$parentId = $newTagId;
				$lastTagId = $newTagId;
				
				// Add to tags array for next iteration
				$tags[$newTagId] = [
					'id' => $newTagId,
					'title' => $segment,
					'parent' => $parentId
				];
			}
		}
		
		return $lastTagId;
	}
}