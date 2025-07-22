<?php include ROOT_DIR . '/views/partials/flash-messages.php'; ?>

<form class="mx-auto" role="form" action="<?php echo $url_builder->build('/tag', ['tag-id' => $tag_id]); ?>"
      method="POST" style="max-width:800px">
    <h3 class="mb-4">Edit tag</h3>

    <div class="row mb-3">
        <label for="title" class="col-sm-2 form-label">Title</label>
        <div class="col-sm-10">
            <input type="text" name="title" class="form-control" id="title" placeholder=""
                   value="<?php echo htmlspecialchars($tag['title']); ?>">
        </div>
    </div>
    <div class="row mb-3">
        <label for="description" class="col-sm-2 form-label">Description</label>
        <div class="col-sm-10">
            <textarea name="description" class="form-control"
                      id="description"><?php echo htmlspecialchars($tag['description']); ?></textarea>
        </div>
    </div>
    <div class="row mb-3">
        <label for="parent" class="col-sm-2 form-label">Parent tag</label>
        <div class="col-sm-10">
            <input type="hidden" class="labels select2-offscreen" id="tags" name="parent" style="width:100%"
                   value="<?php echo $tag['parent'] === 0 ? '' : htmlspecialchars($tag['parent']); ?>" tabindex="-1">
        </div>
    </div>
    <div class="row mb-3">
        <label for="color" class="col-sm-2 form-label">Color</label>
        <div class="col-sm-10">
            <div class="color-selector">
                <input type="hidden" name="color" id="selected-color" value="<?php echo $tag['color'] ?? 'gray'; ?>">
				<?php foreach ($colors as $color => $class) : ?>
                    <div class="color-circle text-bg-<?php echo $class; ?> <?php if ($color === ($tag['color'] ?? 'gray')) {
						echo 'selected';
					} ?>"
                         data-color="<?php echo $color; ?>"
                         title="<?php echo ucfirst($color); ?>">
                    </div>
				<?php endforeach; ?>
            </div>
        </div>
    </div>
    <div class="row mb-3">
        <label for="pinned" class="col-sm-2 form-label">Pinned to top</label>
        <div class="col-sm-10">
            <input type="checkbox" name="pinned" id="pinned"
                   class="form-check-input" <?php if (!empty($tag['pinned'])) echo 'checked'; ?>>
        </div>
    </div>
    <div class="mt-4 d-flex gap-2 justify-content-center flex-wrap">
        <button type="submit" name="task" value="save" class="btn btn-primary btn-lg"
                style="padding-left:30px;padding-right:30px;">Update
        </button>
        <a class="btn btn-outline-secondary btn-lg" href="<?php echo $url_builder->build('/'); ?>">Back</a>
        <button type="button"
            class="btn btn-danger btn-lg ms-auto"
            onclick="submitRequest(
                'DELETE',
                '<?php echo $url_builder->build('/tag', ['tag-id' => $tag_id, 'return' => $url_builder->build('/')]); ?>',
                '<?php echo htmlspecialchars($csrf_token); ?>',
                'Are you sure you want to delete this tag? This action cannot be undone.'
            )"
        >
            Delete
        </button>
    </div>
    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">
</form>


<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Color circle selection logic - pure JavaScript version
        const colorCircles = document.querySelectorAll('.color-circle');
        colorCircles.forEach(circle => {
            circle.addEventListener('click', function () {
                const selectedColor = this.getAttribute('data-color');

                // Update hidden input with selected color value
                document.getElementById('selected-color').value = selectedColor;

                // Update visual selection state
                colorCircles.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    });
</script>


<script src="assets/jquery/jquery.slim.min.js"></script>
<script src="assets/select2/select2.min.js"></script>
<script>
    $(document).ready(function () {
        // Initialize select2 for tags
        $("#tags").select2(
			<?php echo json_encode([
				'tags' => $tags_option_list,
				'maximumSelectionSize' => 1,
			]); ?>
        );
    });
</script>



