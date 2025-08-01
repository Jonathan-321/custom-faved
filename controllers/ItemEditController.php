<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\CSRFProtection;
use Framework\Exceptions\NotFoundException;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use Utils\ItemForm;
use Utils\TagData;
use function Framework\page;
use function Utils\findURLMatches;
use function Utils\groupTagsByParent;

class ItemEditController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$item_id = $_GET['item-id'] ?? null;

		$repository = ServiceContainer::get(Repository::class);
		$url_builder = ServiceContainer::get(UrlBuilder::class);

		$items = $repository->getItems();

		if (null !== $item_id && !isset($items[$item_id])) {
			throw new NotFoundException("Provided item ID does not exist");
		}

		$forms = [];
		$messages = [];

		if (isset($item_id)) { // edit

			$item = $items[$item_id];
			$forms[] = new ItemForm($item, false);

		} elseif (isset($_GET['url'])) { // new pre-populated

			$domain_matched_items = [];
			$matched_items = findURLMatches($_GET['url'], $items, $domain_matched_items);

			if (count($matched_items) > 0) {
				if (count($matched_items) === 1) {
					$messages[] = 'Item with the same URL already exists';
				} else {
					$messages[] = 'There are ' . count($matched_items) . ' items with the same URL';
				}
			}
			foreach ($matched_items as $matched_item) {
				$forms[] = new ItemForm($matched_item, true);
			}

			if (count($domain_matched_items) > 0) {
				if (count($domain_matched_items) === 1) {
					$message = 'There is an item with the same domain:';
				} else {
					$message = 'There are ' . count($domain_matched_items) . ' items with the same domain:';
				}
				$message .= '<ul>';
				foreach ($domain_matched_items as $item) {
					$message .= sprintf(
						'<li><a title="%s" href="%s">%s</a></li>',
						$item['url'],
						$url_builder->build('/item', ['item-id' => $item['id'], 'return' => urlencode($_SERVER['REQUEST_URI'])]),
						$item['title']
					);
				}
				$message .= '</ul>';
				$messages[] = $message;
			}

			$forms[] = new ItemForm($_GET, true);

		} else { // new empty

			$forms[] = new ItemForm([], false);
		}

		$all_tags = $repository->getTags();
		$tags_by_parent = groupTagsByParent($all_tags);
		$tag_data = new TagData($tags_by_parent, $all_tags, []);
		$tags_option_list = $tag_data->build(0);

		$return_url = isset($_GET['return']) ? urldecode($_GET['return']) : $url_builder->build('/');

		$flash = FlashMessages::pull();

		$csrf_token = CSRFProtection::generateToken();

		return page('item-edit', compact(
			'return_url',
			'forms',
			'messages',
			'url_builder',
			'tags_option_list',
			'flash',
			'csrf_token'
		))->layout('primary');
	}
}
