<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'data'    => $this->formatUser($user),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $opts = config('profile_options');

        $validated = $request->validate([
            'fullName'          => 'sometimes|required|string|max:255',
            // Nationality allows free-text via the "other" flow (the frontend sends the
            // user's typed value, not the literal key "other"). Accepted: a known key OR
            // any non-empty string up to the column limit (VARCHAR 100). Mirrors occupation.
            'nationality'       => 'sometimes|nullable|string|max:100',
            // Accepts a known key or null; rejects unrecognised free-text.
            'preferredLanguage' => ['sometimes', 'nullable', Rule::in($opts['preferred_language'])],
            // Occupation allows free-text (the frontend sends the user's typed value, not "other",
            // when they select the "Other" option). We accept any non-empty string up to max length
            // rather than enforcing Rule::in(), so legacy data and custom entries are preserved.
            'occupation'        => 'sometimes|nullable|string|max:255',
            // Accepts a known prefecture key or null; rejects unrecognised values.
            'prefecture'        => ['sometimes', 'nullable', Rule::in($opts['prefecture'])],
        ]);

        /** @var User $user */
        $user = Auth::user();

        $fieldMap = [
            'fullName'          => 'full_name',
            'nationality'       => 'nationality',
            'preferredLanguage' => 'preferred_language',
            'occupation'        => 'occupation',
            'prefecture'        => 'prefecture',
        ];

        $toUpdate = [];
        foreach ($fieldMap as $requestKey => $column) {
            if (array_key_exists($requestKey, $validated)) {
                $toUpdate[$column] = $validated[$requestKey];
            }
        }

        $user->update($toUpdate);

        return response()->json([
            'success' => true,
            'data'    => $this->formatUser($user),
        ]);
    }

    public function destroy(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        try {
            auth()->logout();
        } catch (\Exception) {
            // Token already expired or invalid — soft delete still proceeds.
        }

        $user->delete(); // soft delete — sets deleted_at, preserves all related data

        return response()->json(['success' => true]);
    }

    public function setPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        /** @var User $user */
        $user = Auth::user();

        if ($user->password_hash !== null) {
            return response()->json([
                'success' => false,
                'message' => 'Password already set. Use change-password to update it.',
            ], 409);
        }

        $user->update(['password_hash' => Hash::make($validated['password'])]);

        return response()->json(['success' => true]);
    }

    public function disconnectGoogle(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if ($user->password_hash === null) {
            return response()->json([
                'success' => false,
                'message' => 'Set a password before disconnecting Google to avoid losing access.',
            ], 409);
        }

        $user->update(['google_id' => null, 'avatar_url' => null]);

        return response()->json(['success' => true]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'                 => $user->id,
            'email'              => $user->email,
            'fullName'           => $user->full_name,
            'nationality'        => $user->nationality,
            'preferredLanguage'  => $user->preferred_language,
            'occupation'         => $user->occupation,
            'prefecture'         => $user->prefecture,
            'hasPassword'        => $user->password_hash !== null,
            'hasGoogleConnected' => $user->google_id !== null,
        ];
    }
}
