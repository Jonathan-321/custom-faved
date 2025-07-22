<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h4 class="m-0">Import Bookmarks from Pocket</h4>
                </div>
                <div class="card-body">
					<?php use Utils\PocketImporter;

					include ROOT_DIR . '/views/partials/flash-messages.php'; ?>

                    <p class="card-text mb-4">Import your bookmarks from Pocket by uploading your exported ZIP file.</p>

                    <h5 class="card-title">Instructions:</h5>
                    <ol class="mb-4">
                        <li>Export your data from Pocket using their export tool.</li>
                        <li>Upload the resulting ZIP file using the form below.</li>
                        <li>Faved will process all bookmarks, tags, collections and notes.
                            <ul>
                                <li>Unread and Archived bookmarks will be assigned corresponding tags under
                                    "<?php echo PocketImporter::STATUS_PARENT_TAG_NAME; ?>" parent tag.
                                </li>
                                <li>All imported bookmarks will have
                                    "<?php echo PocketImporter::IMPORT_FROM_POCKET_TAG_NAME; ?>" tag.
                                </li>
                                <li>Collections will be imported as tags under
                                    "<?php echo PocketImporter::COLLECTIONS_PARENT_TAG_NAME; ?>" parent tag.
                                </li>
                                <li>Collection descriptions will be preserved as tag descriptions.</li>
                                <li>Collection bookmark notes will be saved as item comments.</li>
                            </ul>
                        </li>
                    </ol>

                    <form method="post" action="<?php echo $url_builder->build('/pocket-import'); ?>"
                          enctype="multipart/form-data">
                        <div class="mb-3">
                            <label for="pocket-zip" class="form-label">Pocket ZIP Archive</label>
                            <input type="file" class="form-control" id="pocket-zip" name="pocket-zip" accept=".zip"
                                   required>
                            <div class="form-text">Select the ZIP file you exported from Pocket</div>
                        </div>
                        <div class="d-flex justify-content-between">
                            <a href="<?php echo $url_builder->build('/'); ?>"
                               class="btn btn-outline-secondary">Cancel</a>
                            <button type="submit" class="btn btn-primary">Import Bookmarks</button>
                        </div>
                        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
