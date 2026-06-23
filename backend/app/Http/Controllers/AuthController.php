<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'       => 'required|email',
            'password'    => 'required|string|min:8',
            'fullName'    => 'required|string|max:255',
            'forceFresh'  => 'sometimes|boolean',
            'oldPassword' => 'sometimes|nullable|string',
        ]);

        // TODO: enforce restore retention window (e.g. purge accounts soft-deleted > N days)
        $existing = User::withTrashed()->where('email', $validated['email'])->first();

        if ($existing !== null) {
            return $this->handleExistingAccount($existing, $validated);
        }

        return $this->createUser($validated);
    }

    private function handleExistingAccount(User $existing, array $validated): JsonResponse
    {
        if (! $existing->trashed()) {
            return response()->json(['success' => false, 'message' => 'The email address is already in use.'], 422);
        }

        if (! ($validated['forceFresh'] ?? false)) {
            return response()->json([
                'success' => false,
                'code'    => 'ACCOUNT_SOFT_DELETED',
                'message' => 'An account with this email was deleted. Restore it or start fresh.',
            ], 409);
        }

        return $this->executeFreshStart($existing, $validated);
    }

    private function executeFreshStart(User $existing, array $validated): JsonResponse
    {
        // Requiring the old password gates hard-delete to the account owner —
        // without this check anyone who discovers a soft-deleted email could
        // permanently purge all that user's data without credentials.
        $oldPassword = $validated['oldPassword'] ?? null;
        if (! $oldPassword || ! Hash::check($oldPassword, $existing->password_hash)) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials.'], 401);
        }

        // Hard-delete inside a transaction: old data is purged only if the new
        // account creation also succeeds, preventing partial state on DB error.
        // FK cascades: documents, chat_sessions → chat_messages, saved_guides deleted;
        // feedbacks and ai_processing_logs have their user_id nulled (see DEC-014).
        return DB::transaction(function () use ($validated, $existing) {
            $existing->forceDelete();
            return $this->createUser($validated);
        });
    }

    private function createUser(array $validated): JsonResponse
    {
        $user = User::create([
            'id'            => (string) Str::uuid(),
            'email'         => $validated['email'],
            'password_hash' => Hash::make($validated['password']),
            'full_name'     => $validated['fullName'],
        ]);

        return response()->json(['success' => true, 'userId' => $user->id], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // SoftDeletes trait ensures soft-deleted users are excluded automatically.
        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password_hash)) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json(['accessToken' => $token]);
    }

    public function logout(): JsonResponse
    {
        try {
            auth()->logout();
        } catch (\Exception) {
            // Token already expired or invalid — logout still succeeds.
        }

        return response()->json(['success' => true]);
    }

    public function restore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // TODO: enforce restore retention window (e.g. purge accounts soft-deleted > N days)
        $user = User::onlyTrashed()->where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password_hash)) {
            // Generic message — do not reveal whether the email maps to a deleted account.
            return response()->json(['success' => false, 'message' => 'Invalid credentials.'], 401);
        }

        $user->restore();

        $token = JWTAuth::fromUser($user);

        return response()->json(['accessToken' => $token]);
    }
}
