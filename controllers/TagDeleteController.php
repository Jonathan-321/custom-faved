<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\Exceptions\DataWriteException;
use Framework\Exceptions\ValidationException;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use function Framework\redirect;
use function Utils\groupTagsByParent;

class TagDeleteController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$tag_id = $_GET['tag-id'] ?? null;

		if (empty($tag_id)) {
			throw new ValidationException('Tag ID is required');
		}

		$repository = ServiceContainer::get(Repository::class);
		$all_tags = $repository->getTags();
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

		FlashMessages::set('success', 'Tag deleted successfully');
		$url_builder = ServiceContainer::get(UrlBuilder::class);
		$return_url = isset($_GET['return']) ? urldecode($_GET['return']) : $url_builder->build('/');
		return redirect( $return_url);
	}
}
