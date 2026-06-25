<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/', function () {
        return ['message' => 'WorkLife AI API v1'];
    });

    // Public auth routes
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
        Route::post('restore',  [AuthController::class, 'restore']);
    });

    // Protected routes (valid JWT required)
    Route::middleware('auth:api')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::get('profile',    [ProfileController::class, 'show']);
        Route::put('profile',    [ProfileController::class, 'update']);
        Route::delete('account', [ProfileController::class, 'destroy']);

        Route::post('account/password', [ProfileController::class, 'setPassword']);
        Route::delete('account/google', [ProfileController::class, 'disconnectGoogle']);
    });
});
