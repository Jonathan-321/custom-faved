<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h4 class="m-0">Database Setup</h4>
                </div>
                <div class="card-body">
					<?php include ROOT_DIR . '/views/partials/flash-messages.php'; ?>
                    <h5 class="card-title">Welcome to Faved!</h5>

                    <p class="card-text"> Before you can use the application, we need to set up the database.</p>

                    <div class="alert alert-primary">
                        <p><strong>Note:</strong> This will create a database file
                            <code><?php echo htmlspecialchars($db_file); ?></code> with the following tables:</p>
                        <ul>
                            <li><code>items</code> - Stores your bookmarked items</li>
                            <li><code>tags</code> - Stores tags for categorizing items</li>
                            <li><code>items_tags</code> - Connects items with their associated tags</li>
                        </ul>
                    </div>

                    <form method="post" action="<?php echo $url_builder->build('/setup'); ?>" class="mt-4">
                        <div class="d-grid">
                            <button type="submit" class="btn btn-lg btn-primary">Initialize Database</button>
                        </div>
                        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrf_token); ?>">
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

