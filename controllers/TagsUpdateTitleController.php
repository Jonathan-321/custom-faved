<?php

namespace Controllers;

use Framework\Exceptions\ValidationException;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\data;
use function Utils\createTagsFromSegments;

class TagsUpdateTitleController
{
	public function __invoke(array $input): ResponseInterface
	{
		if (!isset($input['tag-id'], $input['title'])) {
			throw new ValidationException('Invalid input data for tag title update.');
		}

		$tag_id = $input['tag-id'];

		$tag_segments = explode('/', $input['title']);
		$tag_segments = array_map('trim', $tag_segments);
		$tag_title = array_pop($tag_segments);

		$parent_id = createTagsFromSegments($tag_segments);
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