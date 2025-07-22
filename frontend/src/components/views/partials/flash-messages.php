<?php if (!empty($flash['error'])) : ?>
    <div class="alert alert-danger">
		<?php echo htmlspecialchars($flash['error']); ?>
    </div>
<?php endif; ?>
<?php if (!empty($flash['success'])) : ?>
    <div class="alert alert-success" role="alert">
		<?php echo htmlspecialchars($flash['success']); ?>
    </div>
<?php endif; ?>
<?php if (!empty($flash['info'])) : ?>
    <div class="alert alert-info" role="alert">
		<?php echo htmlspecialchars($flash['info']); ?>
    </div>
<?php endif; ?>

