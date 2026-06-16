<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// document_category: RESIDENT_TAX | HEALTH_INSURANCE | PENSION | CITY_HALL | WORK_CONTRACT | OTHER
// status: UPLOADED | PROCESSING | COMPLETED | FAILED

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('file_name', 255)->nullable();
            $table->text('file_url')->nullable();
            $table->string('file_type', 50)->nullable();
            $table->string('document_category', 100)->nullable();
            $table->text('ocr_text')->nullable();
            $table->text('ai_summary')->nullable();
            $table->text('ai_action_required')->nullable();
            $table->string('status', 50)->default('UPLOADED');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
