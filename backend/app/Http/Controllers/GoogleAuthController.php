<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Tymon\JWTAuth\Facades\JWTAuth;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception) {
            return redirect("{$frontendUrl}/login?error=google_auth_failed");
        }

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'id'        => (string) Str::uuid(),
                'full_name' => $googleUser->getName() ?? $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar_url' => $googleUser->getAvatar(),
            ]
        );

        // Link Google account to an existing email/password user on first Google sign-in
        if (! $user->google_id) {
            $user->update([
                'google_id'  => $googleUser->getId(),
                'avatar_url' => $googleUser->getAvatar(),
            ]);
        }

        $token = JWTAuth::fromUser($user);

        return redirect("{$frontendUrl}/auth/callback?token={$token}");
    }
}
