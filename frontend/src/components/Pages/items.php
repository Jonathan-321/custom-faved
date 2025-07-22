<div class="row">
    <div class="col-md-3 col-xl-2">
        <div class="offcanvas-md offcanvas-start" tabindex="-1" id="sidebar" aria-labelledby="sidebar-label">
            <div class="offcanvas-header d-flex gap-1 p-md-0 mb-md-3">
                <h5 class="offcanvas-title me-auto" id="sidebar-label">
                    <img src="/assets/images/logo.png" alt="Faved logo" class="img-fluid " width="48">
                    Faved
                </h5>

                <a class="btn btn-outline-secondary  ms-auto"
                   href="<?php echo $url_builder->build('/settings/auth'); ?>">
                    <i class="bi bi-sliders2"></i>
                </a>

                <button type="button" class="btn-close ms-3 d-md-none" data-bs-dismiss="offcanvas"
                        data-bs-target="#sidebar"
                        aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="sidebar-content">

                    <div class="list-group mb-3">
                        <a class="list-group-item list-group-item-action <?php echo $selected_tag === null ? 'active' : ''; ?>"
                           href="<?php echo $url_builder->build('/'); ?>">All items</a>
                        <a class="list-group-item list-group-item-action <?php echo $selected_tag === 'notag' ? 'active' : ''; ?>"
                           href="<?php echo $url_builder->build('/', ['tag' => 'notag']); ?>">Untagged </a>
                    </div>
                    <ul class="tags-list list-group">
						<?php echo $pinned_tags_output; ?>
						<?php echo $unpinned_tags_output; ?>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-9 col-xl-10">
        <div class="mb-4 d-flex justify-content-start align-items-center flex-wrap gap-2" style="margin-top: 5px;">
            <button class="btn btn-outline-dark d-md-none me-auto" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#sidebar" aria-controls="sidebar">
                <i class="bi bi-list"></i>
            </button>

            <a class="btn btn-outline-primary"
               href="<?php echo $url_builder->build('/item', ['return' => urlencode($_SERVER['REQUEST_URI'])]); ?>"
               id="add-item-button" role="button">
                New item
            </a>
            <div class="dropdown">
                <a class="btn btn-outline-secondary " href="#" role="button" data-bs-toggle="dropdown"
                   aria-expanded="false">
                    <i class="bi bi-box-arrow-in-down"></i>
                </a>

                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="<?php echo $url_builder->build('/pocket-import'); ?>">Import from
                            Pocket</a></li>
                </ul>
            </div>

			<?php if ($user): ?>
                <div class="dropdown ms-auto">
                    <a class="btn btn-outline-secondary " href="#" role="button" data-bs-toggle="dropdown"
                       aria-expanded="false">
                        <i class="bi bi-person"></i>
                    </a>

                    <ul class="dropdown-menu">
                        <li><h6 class="dropdown-header"><?php echo htmlspecialchars($user['username']); ?></h6></li>
                        <li><a class="dropdown-item" href="#" role="button" onclick="submitRequest(
                                    'POST',
                                    '<?php echo $url_builder->build('/logout'); ?>',
                                    '<?php echo htmlspecialchars($csrf_token); ?>',
                                    null
                                    )">
                                <i class="bi bi-box-arrow-right"></i> Logout
                            </a></li>
                    </ul>
                </div>
			<?php endif; ?>

        </div>

		<?php include ROOT_DIR . '/views/partials/flash-messages.php'; ?>

        <div class="d-table w-100">
			<?php foreach ($items as $item_id => $item) : ?>
                <div class="d-table-row">
                    <div class="d-table-cell text-break pb-4 pe-2">
						<?php if (!empty($item['image'])) : ?>
                            <a href="<?php echo htmlspecialchars($item['image']); ?>"
                               class="me-3 float-start border-1 border border-secondary border-opacity-10 p-1">
                                <img style="max-width:150px;max-height:150px;"
                                     alt="<?php echo htmlspecialchars($item['image']); ?>"
                                     src="<?php echo htmlspecialchars($item['image']); ?>"/>
                            </a>
						<?php endif; ?>

                        <h6 class="mb-2">
							<?php echo htmlspecialchars($item['title']); ?>
                        </h6>

						<?php if ($item['url']) : ?>
                            <div class="my-2">
                                <a href="<?php echo htmlspecialchars($item['url']); ?>">
									<?php echo htmlspecialchars($item['url']); ?>
                                </a>
                            </div>
						<?php endif; ?>

                        <div class="d-sm-none text-break my-2">
							<?php echo nl2br(htmlentities($item['description'])); ?>

							<?php if (!empty($item['comments'])) : ?>
                                <div class="bi bi-chat-left-text mt-2">
									<?php echo nl2br(htmlentities($item['comments'])); ?>
                                </div>
							<?php endif; ?>
                        </div>

						<?php foreach ($item['tags'] as $tag_id) : ?>
							<?php echo $tag_renderer->render($tag_id); ?>
						<?php endforeach; ?>

                        <small class="text-nowrap d-block d-md-inline" style="line-height: 2.5">
							<?php echo $item['created_at']; ?>
                        </small>
                    </div>
                    <div class="d-none d-sm-table-cell text-break pb-4 pe-2" style="width: 45%">
						<?php echo nl2br(htmlentities($item['description'])); ?>

						<?php if (!empty($item['comments'])) : ?>
                            <div class="bi bi-chat-left-text mt-2">
								<?php echo nl2br(htmlentities($item['comments'])); ?>
                            </div>
						<?php endif; ?>
                    </div>
                    <div class="d-table-cell">
                        <div class="dropdown">
                            <button type="button" class="btn btn-outline-secondary"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu" role="menu">
                                <li>
                                    <a class="dropdown-item"
                                       href="<?php echo $url_builder->build('/item', ['item-id' => $item_id, 'return' => urlencode($_SERVER['REQUEST_URI'])]); ?>">
                                        Edit
                                    </a>
                                </li>
                                <li>

                                    <button type="button"
                                            class="dropdown-item"
                                            onclick="submitRequest(
                                                    'DELETE',
                                                    '<?php echo $url_builder->build('/item', ['item-id' => $item_id, 'return' => urlencode($_SERVER['REQUEST_URI'])]); ?>',
                                                    '<?php echo htmlspecialchars($csrf_token); ?>',
                                                    'Are you sure you want to delete this item?'
                                                    )"
                                    >
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
			<?php endforeach; ?>
        </div>
        <div class="text-center">
			<?php echo count($items); ?>
			<?php echo count($items) !== 1 ? 'items' : 'item'; ?>
        </div>
    </div>
</div>
