<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'fullName' => 'required|string|max:255',
        ]);

        $user = User::create([
            'id'            => (string) Str::uuid(),
            'email'         => $validated['email'],
            'password_hash' => Hash::make($validated['password']),
            'full_name'     => $validated['fullName'],
        ]);

        return response()->json([
            'success' => true,
            'userId'  => $user->id,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password_hash)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'accessToken' => $token,
        ]);
    }
}
