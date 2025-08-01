<?php

namespace Controllers;

use Exception;
use Framework\ControllerInterface;
use Framework\FlashMessages;
use Framework\Responses\ResponseInterface;
use Framework\ServiceContainer;
use Framework\UrlBuilder;
use Models\Repository;
use Models\TagCreator;
use Utils\PocketImporter;
use ZipArchive;
use function Framework\redirect;

class PocketImportRunController implements ControllerInterface
{
	public function __invoke(array $input): ResponseInterface
	{
		$url_builder = ServiceContainer::get(UrlBuilder::class);

		// Check if file was uploaded
		if (!isset($_FILES['pocket-zip']) || $_FILES['pocket-zip']['error'] !== UPLOAD_ERR_OK) {
			FlashMessages::set('error', 'No file uploaded or upload error');
			return redirect( $url_builder->build('/pocket-import'));
		}

		$uploaded_file = $_FILES['pocket-zip'];

		// Check if the file is a ZIP
		if ($uploaded_file['type'] !== 'application/zip' && $uploaded_file['type'] !== 'application/x-zip-compressed') {
			FlashMessages::set('error', 'Uploaded file is not a ZIP archive');
			return redirect( $url_builder->build('/pocket-import'));
		}

		// Create a temporary directory
		$temp_dir = sys_get_temp_dir() . '/pocket_import_' . uniqid('', false);
		if (!mkdir($temp_dir, 0777, true) && !is_dir($temp_dir)) {
			FlashMessages::set('error', 'Uploaded file is not a ZIP archive');
			return redirect( $url_builder->build('/pocket-import'));
		}
		try {
			// Extract the ZIP file
			$zip = new ZipArchive();
			if ($zip->open($uploaded_file['tmp_name']) !== true) {
				throw new Exception('Failed to open ZIP archive');
			}

			$zip->extractTo($temp_dir);
			$zip->close();

			// Process the extracted files
			$importer = new PocketImporter(
				ServiceContainer::get(Repository::class),
				ServiceContainer::get(TagCreator::class)
			);
			$import_count = $importer->processFiles($temp_dir);

			// Clean up
			$this->removeDirectory($temp_dir);

			FlashMessages::set('success', $import_count . ' Pocket bookmarks imported successfully');
			return redirect( $url_builder->build('/'));
		} catch (Exception $e) {
			// Clean up on error
			$this->removeDirectory($temp_dir);

			FlashMessages::set('error', 'Error importing bookmarks: ' . $e->getMessage());
			return redirect( $url_builder->build('/pocket-import'));
		}
	}

	private function removeDirectory(string $dir)
	{
		if (!is_dir($dir)) {
			return;
		}
		$objects = scandir($dir);
		foreach ($objects as $object) {
			if ($object === '.' || $object === '..') {
				continue;
			}
			$object_path = $dir . '/' . $object;
			if (is_dir($object_path)) {
				$this->removeDirectory($object_path);
			} else {
				unlink($object_path);
			}
		}
		rmdir($dir);
	}
}
