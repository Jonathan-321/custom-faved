<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\Exceptions\ValidationException;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use Models\TagCreator;
use function Framework\redirect;

class TagUpdateController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		if (!isset($_GET['tag-id'], $_POST['title'], $_POST['description'], $_POST['parent'], $_POST['color'])) {
			throw new ValidationException('Invalid input data for tag update');
		}

		$parent_tag = $_POST['parent'];

		if ('' !== $parent_tag && !empty($_POST['pinned'])) {
			throw new ValidationException('Pinned tags cannot have a parent tag');
		}

		$tag_id = $_GET['tag-id'];

		$repository = ServiceContainer::get(Repository::class);
		$url_builder = ServiceContainer::get(UrlBuilder::class);


		$tag_creator = ServiceContainer::get(TagCreator::class);
		$tags = $repository->getTags();
		unset($tags[$tag_id]);

		if (isset($tags[$parent_tag])) {
			$parent_tag_id = $tags[$parent_tag]['id'];
		} elseif ('' === $parent_tag) {
			$parent_tag_id = 0;
		} else {
			$tag_segments = explode('/', $parent_tag);
			$tag_segments = array_map('trim', $tag_segments);

			$parent_tag_id = 0;
			$check_existing_parent = true;
			foreach ($tag_segments as $tag_title) {
				$existing_parent = array_find($tags, function ($tag) use ($tag_title, $parent_tag_id) {
					return $tag['title'] === $tag_title && $tag['parent'] === $parent_tag_id;
				});

				if ($check_existing_parent && $existing_parent) {
					$parent_tag_id = $existing_parent['id'];
					continue;
				}

				$parent_tag_id = $tag_creator->createTag($tag_title, '', $parent_tag_id);
				$check_existing_parent = false;
			}
		}

		$repository->updateTag(
			$tag_id,
			$_POST['title'],
			$_POST['description'],
			$parent_tag_id,
			$_POST['color'],
			!empty($_POST['pinned'])
		);

		FlashMessages::set('success', 'Tag updated successfully');
		return redirect($url_builder->build('/'));
	}
}
