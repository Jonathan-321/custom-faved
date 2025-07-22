<?php include ROOT_DIR . '/views/partials/flash-messages.php'; ?>

<?php foreach ($messages as $message): ?>
    <div class="alert alert-warning" role="alert"><?php echo $message; ?></div>
<?php endforeach; ?>

<?php if (count($forms) > 1): ?>
    <ul class="nav nav-tabs" id="myTab" role="tablist" style="margin-bottom: 20px">
		<?php foreach ($forms as $key => $form) : ?>
            <li role="presentation" class="nav-item">
                <button class="nav-link <?php echo $key === 0 ? 'show active' : ''; ?>"
                        id="form-tab-<?php echo $key; ?>" data-bs-toggle="tab"
                        data-bs-target="#form-<?php echo $key; ?>" type="button" role="tab"
                        aria-controls="form-<?php echo $key; ?>" aria-selected="true">
					<?php echo htmlspecialchars($form->tab_name); ?>
                </button>
            </li>
		<?php endforeach; ?>

    </ul>
<?php endif; ?>
<div class="tab-content" id="myTabContent">

	<?php foreach ($forms as $key => $form) : ?>
        <div class="tab-pane  <?php echo $key === 0 ? 'show active' : ''; ?>" id="form-<?php echo $key; ?>"
             role="tabpanel" aria-labelledby="form-tab-<?php echo $key; ?>" tabindex="0">
            <form class="mx-auto" role="form" action="<?php echo $form->action; ?>" method="POST"
                  style="max-width:800px">
                <a href="<?php echo $url_builder->build('/'); ?>" class="float-end">
                    View list
                </a>
                <h3 class="mb-4"><?php echo htmlspecialchars($form->heading); ?></h3>

                <div class="row mb-3">
                    <label for="title" class="col-sm-2 form-label">Title</label>
                    <div class="col-sm-10">
                        <input type="text" name="title" class="form-control" id="title" placeholder=""
                               value="<?php echo htmlspecialchars($form->title); ?>">
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="url" class="col-sm-2 form-label">URL</label>
                    <div class="col-sm-10">
                        <input type="text" name="url" class="form-control" id="url" placeholder="https://"
                               autocomplete="off" value="<?php echo htmlspecialchars($form->url); ?>">
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="description" class="col-sm-2 form-label">Description</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" rows="3" name="description"
                                  id="description"><?php echo htmlspecialchars($form->description); ?></textarea>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="comments" class="col-sm-2 form-label">Comments</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" rows="3" name="comments"
                                  id="comments"><?php echo htmlspecialchars($form->comments); ?></textarea>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="image" class="col-sm-2 form-label">Image URL</label>
                    <div class="col-sm-10">
                        <input type="text" name="image" class="form-control" id="image" placeholder="https://"
                               value="<?php echo htmlspecialchars($form->image); ?>">
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="tags" class="col-sm-2 form-label">Tags</label>
                    <div class="col-sm-10">
                        <input type="hidden" class="labels select2-offscreen" name="tags" style="width:100%"
                               value="<?php echo htmlspecialchars(implode(', ', $form->tags)); ?>">
                    </div>
                </div>
				<?php if (isset($form->created_at)) : ?>
                    <div class="row mb-3">
                        <label for="tags" class="col-sm-2 form-label">Created at</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" readonly disabled
                                   value="<?php echo htmlspecialchars($form->created_at); ?>">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="tags" class="col-sm-2 form-label">Updated at</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" readonly disabled
                                   value="<?php echo htmlspecialchars($form->updated_at ?? $form->created_at); ?>"
                            >
                        </div>
                    </div>
				<?php endif; ?>
                <div class="mt-4 d-flex gap-2 justify-content-center flex-wrap">
					<?php if ($form->from_bookmarklet) : ?>
                        <button type="submit" name="task" value="save-close" class="btn btn-primary btn-lg"
                                style="padding-left:40px;padding-right:40px;">Save & Close
                        </button>
					<?php else: ?>
                        <button type="submit" name="task" value="save-back" class="btn btn-primary btn-lg"
                                style="padding-left:40px;padding-right:40px;">Save & Back
                        </button>
					<?php endif; ?>

					<?php if ($form->item_id) : ?>
                        <button type="submit" name="task" value="save-as-copy" class="btn btn-outline-secondary btn-lg">
                            Save as Copy
                        </button>
					<?php else: ?>
                        <button type="submit" name="task" value="save-new" class="btn btn-outline-secondary btn-lg">Save
                            & New
                        </button>
					<?php endif; ?>

                    <button type="submit" name="task" value="save" class="btn btn-outline-secondary btn-lg">
                        Save
                    </button>

					<?php if ($form->from_bookmarklet) : ?>
                        <button type="button" onclick="window.close()" class="btn btn-outline-secondary btn-lg">Close
                        </button>
					<?php else: ?>
                        <a href="<?php echo htmlspecialchars($return_url); ?>" class="btn btn-outline-secondary btn-lg">Back</a>
					<?php endif; ?>

					<?php if ($form->item_id) : ?>
                        <button type="button"
                                class="btn btn-danger btn-lg ms-auto"
                                onclick="submitRequest(
                                        'DELETE',
                                        '<?php echo $url_builder->build('/item', ['item-id' => $form->item_id, 'return' => htmlspecialchars($return_url)]); ?>',
                                        '<?php echo htmlspecialchars($csrf_token); ?>',
                                        'Are you sure you want to delete this item?'
                                        )"
                        >
                            Delete
                        </button>
					<?php endif; ?>

                </div>
                <input type="hidden" name="return" value="<?php echo htmlspecialchars($return_url); ?>">
                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">

            </form>
        </div>
	<?php endforeach; ?>

    <script src="assets/jquery/jquery.slim.min.js"></script>
    <script src="assets/select2/select2.min.js"></script>
    <script>
        $(document).ready(function () {
            // Initialize select2 for tags
            $(".labels").select2(
				<?php echo json_encode([
					'tags' => $tags_option_list,
				]); ?>
            );
        });
    </script>
