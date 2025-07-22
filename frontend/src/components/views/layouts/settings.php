<div class="row">
    <div class="col-md-3 col-xl-2">
        <div class="offcanvas-md offcanvas-start" tabindex="-1" id="sidebar" aria-labelledby="sidebar-label">
            <div class="offcanvas-header d-flex gap-1 p-md-0 mb-md-3">
                <h5 class="offcanvas-title me-auto" id="sidebar-label">
                    <img src="/assets/images/logo.png" alt="Faved logo" class="img-fluid " width="48">
                    Faved
                </h5>

                <a class="btn btn-outline-secondary ms-auto active"
                   href="<?php echo $url_builder->build('/'); ?>">
                    <i class="bi bi-sliders2"></i>
                </a>

                <button type="button" class="btn-close ms-3 d-md-none" data-bs-dismiss="offcanvas"
                        data-bs-target="#sidebar"
                        aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="sidebar-content">

                    <div class="list-group mb-3">
                        <a href="<?php echo $url_builder->build('/settings/auth'); ?>"
                           class="list-group-item list-group-item-action <?php echo ($active_tab === 'auth') ? 'active' : ''; ?>" <?php echo ($active_tab === 'auth') ? 'aria-current="true"' : ''; ?>>
                            Authentication
                        </a>
                        <a href="<?php echo $url_builder->build('/settings/bookmarklet'); ?>"
                           class="list-group-item list-group-item-action <?php echo ($active_tab === 'bookmarklet') ? 'active' : ''; ?>" <?php echo ($active_tab === 'auth') ? 'aria-current="true"' : ''; ?>>
                            Bookmarklet
                        </a>
                    </div>
                    <a class="mb-3 d-block text-decoration-none" href="<?php echo $url_builder->build('/'); ?>">
                        <i class="bi bi-arrow-left"></i> Back to list
                    </a>
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
        </div>
        <div class="mx-auto" style="max-width: 650px;">
			<?php echo $content; ?>
        </div>
    </div>

</div>