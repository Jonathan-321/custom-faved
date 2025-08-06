<?php

namespace Controllers;

use Framework\Exceptions\ValidationException;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use http\Exception\RuntimeException;
use Models\Repository;
use function Framework\data;
use function Utils\createTagsFromSegments;
use function Utils\extractTagSegments;

class TagsUpdateTitleController
{
	public function __invoke(array $input): ResponseInterface
	{
		if (!isset($input['tag-id'], $input['title'])) {
			throw new ValidationException('Invalid input data for tag title update.');
		}

		$tag_id = $input['tag-id'];

		$tag_segments = extractTagSegments($input['title']);
		$tag_title = array_pop($tag_segments);

		$parent_id = createTagsFromSegments($tag_segments);

		if ($parent_id === $tag_id) {
			throw new RuntimeException('Tag cannot be its own parent.');
		}

		$repository = ServiceContainer::get(Repository::class);
		$repository->updateTagTitle(
			$tag_id,
			$tag_title,
			$parent_id,
		);

		return data([
			'success' => true,
			'message' => 'Tag title updated successfully',
			'data' => [
				'tag_id' => $tag_id,
				'title' => $input['title'],
			]
		]);
	}

}