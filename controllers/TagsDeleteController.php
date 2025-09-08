<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\Exceptions\DataWriteException;
use Framework\Exceptions\ValidationException;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Models\Repository;
use function Framework\data;
use function Utils\groupTagsByParent;

class TagsDeleteController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$tag_id = $input['tag-id'] ?? null;

		if (empty($tag_id)) {
			throw new ValidationException('Tag ID is required');
		}

		$repository = ServiceContainer::get(Repository::class);
		$all_tags = $repository->getTags();

		if (!isset($all_tags[$tag_id])) {
			throw new ValidationException("Tag with ID $tag_id does not exist");
		}

		$tags_by_parent = groupTagsByParent($all_tags);
		if (isset($tags_by_parent[$tag_id])) {
			throw new ValidationException("Tag can't be deleted as it has child tags. Please delete child tags first.");
		}

		$repository = ServiceContainer::get(Repository::class);
		$result = $repository->deleteItemTag($tag_id);

		if (false === $result) {
			throw new DataWriteException("Error removing tag from items");
		}

		$result = $repository->deleteTag($tag_id);

		if (false === $result) {
			throw new DataWriteException("Error deleting tag");
		}

		return data([
			'success' => true,
			'message' => 'Tag deleted successfully',
		]);
	}

}
