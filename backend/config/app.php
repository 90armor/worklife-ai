<?php

return [
    'name'         => env('APP_NAME', 'Laravel'),
    'env'          => env('APP_ENV', 'production'),
    'debug'        => (bool) env('APP_DEBUG', false),
    'url'          => env('APP_URL', 'http://localhost'),
    'key'          => env('APP_KEY'),
    'cipher'       => 'AES-256-CBC',
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
];
