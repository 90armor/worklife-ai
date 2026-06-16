<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// category: IMMIGRATION | TAX | INSURANCE | WORKPLACE | HOUSING | BANKING

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('knowledge_chunks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('guide_id')->nullable()->constrained('guides')->nullOnDelete();
            $table->string('title', 255)->nullable();
            $table->string('category', 100)->nullable();
            $table->text('content')->nullable();
            $table->text('source_url')->nullable();
            $table->string('language', 20)->nullable();
            $table->timestamp('created_at')->nullable();
        });

        $dimensions = (int) config('services.openai.embedding_dimensions', 1536);
        DB::statement("ALTER TABLE knowledge_chunks ADD COLUMN embedding vector({$dimensions})");

        // HNSW index for approximate nearest-neighbour cosine similarity search
        DB::statement('CREATE INDEX idx_knowledge_chunks_embedding ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)');
    }

    public function down(): void
    {
        Schema::dropIfExists('knowledge_chunks');
    }
};
