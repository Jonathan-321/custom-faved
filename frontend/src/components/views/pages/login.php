<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <h3 class="text-center mb-4 d-flex align-items-center justify-content-center">
                <img src="/assets/images/logo.png" alt="Faved logo" class="img-fluid " width="48">
                Faved
            </h3>
            <div class="card">
                <div class="card-header">
                    <h4 class="mb-0">Login</h4>
                </div>
                <div class="card-body pb-4">
					<?php include ROOT_DIR . '/views/partials/flash-messages.php'; ?>

                    <form method="post" action="<?php echo $url_builder->build('/login') ?>">
                        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">

                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" name="username" required>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>

                        <button type="submit" class="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
