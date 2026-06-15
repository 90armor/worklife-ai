<?php

return [
    'openai' => [
        'key' => env('OPENAI_API_KEY'),
        'embedding_model' => env('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small'),
        'chat_model' => env('OPENAI_CHAT_MODEL', 'gpt-4o-mini'),
        'embedding_dimensions' => (int) env('OPENAI_EMBEDDING_DIMENSIONS', 1536),
    ],

    'supabase' => [
        'url' => env('SUPABASE_URL'),
        'service_key' => env('SUPABASE_SERVICE_KEY'),
        'bucket' => env('SUPABASE_BUCKET', 'uploads'),
    ],
];
