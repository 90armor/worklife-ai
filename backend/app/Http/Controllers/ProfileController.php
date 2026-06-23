<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
        $validated = $request->validate([
            'fullName'          => 'sometimes|required|string|max:255',
            'nationality'       => 'sometimes|nullable|string|max:100',
            'preferredLanguage' => 'sometimes|nullable|string|max:50',
            'occupation'        => 'sometimes|nullable|string|max:255',
            'prefecture'        => 'sometimes|nullable|string|max:100',
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
