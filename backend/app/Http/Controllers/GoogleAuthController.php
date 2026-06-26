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

        $email = $googleUser->getEmail();

        // firstOrCreate applies the SoftDeletes scope and would miss a soft-deleted
        // row, hitting the unique index and throwing an unhandled QueryException.
        // Redirect to register so the user can choose to restore or start fresh.
        if (User::onlyTrashed()->where('email', $email)->exists()) {
            return redirect("{$frontendUrl}/register?error=account_deleted");
        }

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'id'        => (string) Str::uuid(),
                'full_name' => $googleUser->getName() ?? $email,
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
