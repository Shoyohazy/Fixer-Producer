function initSubmitContact() {
    const $form = $('#contact-form');
    const $success = $('#success-message');
    const $error = $('#error-message');
    const $submitButton = $form.find('button[type="submit"]');

    if (!$form.length) return;

    $form.on('submit', function (event) {
        event.preventDefault();

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const subject = $('#subject').val().trim();
        const projectType = $('#project-type').val().trim();
        const message = $('#Message').val().trim();

        let isValid = true;

        function validateEmail(email) {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        }

        if (name === "" || email === "" || subject === "" || message === "") {
            isValid = false;
        }
        if (!validateEmail(email)) {
            isValid = false;
        }
        if (projectType === "") {
            isValid = false;
        }

        if (!isValid) {
            $error.removeClass('hidden');
            setTimeout(() => {
                $error.addClass('hidden');
            }, 3000);
            return;
        }

        const actionUrl = $form.attr('action');
        const formData = new FormData($form[0]);

        try {
            $submitButton.prop('disabled', true);

            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok && (result.success === 'true' || result.success === true)) {
                $success.removeClass('hidden');
                $form[0].reset();
                $('.selected-text').text('Project Type');

                setTimeout(() => {
                    $success.addClass('hidden');
                }, 3000);
            } else {
                $error.removeClass('hidden');
                setTimeout(() => {
                    $error.addClass('hidden');
                }, 3000);
            }
        } catch (err) {
            $error.removeClass('hidden');
            setTimeout(() => {
                $error.addClass('hidden');
            }, 3000);
        } finally {
            $submitButton.prop('disabled', false);
        }
    });
}
