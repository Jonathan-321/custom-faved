<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Faved - Links organized</title>

    <link href="assets/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/bootstrap-icons-1.13.1/bootstrap-icons.min.css">
    <link href="assets/select2/select2.css" rel="stylesheet"/>
    <link href="assets/styles.css" rel="stylesheet"/>
</head>
<body>
<?php echo $content; ?>

<script src="assets/bootstrap/js/bootstrap.bundle.min.js"></script>

<script>
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    submitRequest = function (method, action, csrfToken, alertMessage) {

        if (alertMessage && !confirm(alertMessage)) {
            return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = action;

        const addInput = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };
        addInput('force-method', method);
        addInput('csrf_token', csrfToken);

        document.body.appendChild(form);
        form.submit();
    }

</script>
</body>
</html>