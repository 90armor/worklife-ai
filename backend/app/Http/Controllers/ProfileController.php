<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    private function formatUser(User $user): array
    {
        return [
            'id'                => $user->id,
            'fullName'          => $user->full_name,
            'nationality'       => $user->nationality,
            'preferredLanguage' => $user->preferred_language,
            'occupation'        => $user->occupation,
            'prefecture'        => $user->prefecture,
        ];
    }
}
