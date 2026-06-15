<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class SupabaseStorageService
{
    private string $url;
    private string $key;
    private string $bucket;

    public function __construct()
    {
        $this->url = rtrim(config('services.supabase.url'), '/');
        $this->key = config('services.supabase.service_key');
        $this->bucket = config('services.supabase.bucket');
    }

    /**
     * Upload a file and return its storage path.
     */
    public function upload(UploadedFile $file, ?string $folder = null): string
    {
        $path = trim(($folder ? $folder . '/' : '') . Str::uuid() . '.' . $file->extension(), '/');

        $response = Http::withToken($this->key)
            ->withBody(file_get_contents($file->getRealPath()), $file->getMimeType())
            ->post("{$this->url}/storage/v1/object/{$this->bucket}/{$path}");

        if ($response->failed()) {
            throw new RuntimeException('Supabase upload failed: ' . $response->body());
        }

        return $path;
    }

    /**
     * Public URL for a stored object.
     */
    public function publicUrl(string $path): string
    {
        return "{$this->url}/storage/v1/object/public/{$this->bucket}/{$path}";
    }

    public function delete(string $path): void
    {
        Http::withToken($this->key)
            ->delete("{$this->url}/storage/v1/object/{$this->bucket}/{$path}");
    }
}
