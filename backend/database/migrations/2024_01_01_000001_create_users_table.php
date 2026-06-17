<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email', 255)->unique();
            $table->string('google_id', 255)->nullable()->unique();
            $table->string('password_hash', 255)->nullable();
            $table->string('full_name', 255);
            $table->string('avatar_url', 2048)->nullable();
            $table->string('nationality', 100)->nullable();
            $table->string('preferred_language', 50)->nullable();
            $table->string('prefecture', 100)->nullable();
            $table->string('occupation', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
