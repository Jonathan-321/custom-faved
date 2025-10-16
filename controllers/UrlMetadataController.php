<?php

namespace Controllers;

use Framework\ControllerInterface;
use Framework\Exceptions\ValidationException;
use Framework\Responses\ResponseInterface;
use Utils\DOMParser;
use function Framework\data;
use function Utils\fetchPageHTML;
use function Utils\resolveUrl;
use function Utils\suggestTags;

class UrlMetadataController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$url = $input['url'] ?? null;

		if (empty($url)) {
			throw new ValidationException('URL is required');
		}

		// Validate URL format
		if (!filter_var($url, FILTER_VALIDATE_URL)) {
			throw new ValidationException('Invalid URL format');
		}

		$html = fetchPageHTML($url);

		$parser = new DOMParser($html);

		$image_url = $parser->extractImage();
		if ($image_url) {
			$image_url = resolveUrl($image_url, $url);
		}

		$suggested_tags = suggestTags($url, $parser->extractTitle() ?? '', $parser->extractDescription() ?? '');

		return data([
			'success' => true,
			'message' => 'Metadata fetched successfully',
			'data' => [
				'title' => $parser->extractTitle() ?? parse_url($url, PHP_URL_HOST),
				'description' => $parser->extractDescription() ?? '',
				'image_url' => $image_url ?? '',
				'url' => $url,
				'suggested_tags' => $suggested_tags
			]
		]);
	}
}
