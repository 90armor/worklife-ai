<?php

use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;

Route::prefix('documents')->group(function () {
    Route::post('/', [DocumentController::class, 'store']);
    Route::post('/search', [DocumentController::class, 'search']);
    Route::post('/ask', [DocumentController::class, 'ask']);
});

Route::get('/health', fn () => response()->json(['status' => 'ok']));
