<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

        Schema::create('documents', function ($table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('file_path')->nullable();
            $table->timestamps();
        });

        // Vector column sized to the configured embedding dimensions.
        $dimensions = (int) config('services.openai.embedding_dimensions', 1536);
        DB::statement("ALTER TABLE documents ADD COLUMN embedding vector({$dimensions})");

        // IVFFlat index for cosine similarity search.
        DB::statement('CREATE INDEX documents_embedding_idx ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)');
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
