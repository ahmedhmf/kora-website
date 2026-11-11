<?php
// Copy to the directory immediately ABOVE public_html as brevo-keys.php.
// Never place the real API key inside public_html or the website source code.
return [
    'api_key' => 'REPLACE_WITH_BREVO_API_KEY',
    'list_id' => 0, // Replace with your Brevo contact list ID (integer).
    'template_id' => 0, // Replace with your Brevo double-opt-in email template ID.
];
