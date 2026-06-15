<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAIService
{
    private string $apiKey;
    private string $embeddingModel;
    private string $chatModel;

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
        $this->embeddingModel = config('services.openai.embedding_model');
        $this->chatModel = config('services.openai.chat_model');
    }

    /**
     * Generate an embedding vector for the given text.
     *
     * @return array<int, float>
     */
    public function embed(string $text): array
    {
        $response = Http::withToken($this->apiKey)
            ->post('https://api.openai.com/v1/embeddings', [
                'model' => $this->embeddingModel,
                'input' => $text,
            ]);

        if ($response->failed()) {
            throw new RuntimeException('OpenAI embedding failed: ' . $response->body());
        }

        return $response->json('data.0.embedding');
    }

    /**
     * Chat completion grounded on optional context passages.
     *
     * @param array<int, string> $context
     */
    public function chat(string $prompt, array $context = []): string
    {
        $system = 'You are a helpful assistant. Answer using the provided context when relevant.';

        if ($context) {
            $system .= "\n\nContext:\n" . implode("\n---\n", $context);
        }

        $response = Http::withToken($this->apiKey)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $this->chatModel,
                'messages' => [
                    ['role' => 'system', 'content' => $system],
                    ['role' => 'user', 'content' => $prompt],
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('OpenAI chat failed: ' . $response->body());
        }

        return $response->json('choices.0.message.content');
    }
}
