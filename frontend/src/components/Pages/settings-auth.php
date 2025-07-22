<h2 class="mb-4">Authentication settings</h2>

<?php include ROOT_DIR . '/views/partials/flash-messages.php'; ?>

<div class="d-flex flex-column gap-4">

	<?php if ($user) : ?>

        <div class="card">
            <div class="card-header">
                <h4 class="m-0">Username</h4>
            </div>
            <div class="card-body">
                <form method="POST" action="<?php echo $url_builder->build('/settings/username'); ?>">
                    <div class="mb-3">
                        <label for="username" class="form-label">New Username</label>
                        <input type="text" class="form-control" id="username" name="username"
                               value="<?php echo htmlspecialchars($user['username']) ?>" required>
                    </div>
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">
                    <button type="submit" name="update_username" class="btn btn-primary">Update Username
                    </button>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h4 class="m-0">Change Password</h4>
            </div>
            <div class="card-body">
                <form method="POST" action="<?php echo $url_builder->build('/settings/password'); ?>">
                    <div class="mb-3">
                        <label for="password" class="form-label">New Password</label>
                        <input type="password" class="form-control" id="password"
                               name="password" minlength="6" required>
                    </div>
                    <div class="mb-3">
                        <label for="confirm_password" class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control" id="confirm_password"
                               name="confirm_password" minlength="6" required>
                    </div>
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">
                    <button type="submit" name="update_password" class="btn btn-primary">Change Password
                    </button>
                </form>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h4 class="m-0">Disable authentication</h4>
            </div>
            <div class="card-body">
                <form method="POST" action="<?php echo $url_builder->build('/settings/delete-user'); ?>">
                    <p>Disabling authentication will remove your user account and disable login functionality.</p>
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">
                    <button type="submit" class="btn btn-danger">Disable authentication</button>
                </form>
            </div>
        </div>

	<?php else: ?>

        <div class="card">
            <div class="card-header">
                <h4 class="m-0">Create user</h4>
            </div>
            <div class="card-body">
                <form method="POST" action="<?php echo $url_builder->build('/settings/create-user'); ?>">
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username" name="username"
                               required>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Set Password</label>
                        <input type="password" class="form-control" id="password"
                               name="password" minlength="6" required>
                    </div>
                    <div class="mb-3">
                        <label for="confirm_password" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="confirm_password"
                               name="confirm_password" minlength="6" required>
                    </div>
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">
                    <button type="submit" class="btn btn-primary">Create user</button>
                </form>
            </div>
        </div>
	<?php endif; ?>
</div>