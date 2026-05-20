<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json([
            'user' => new UserResource(
                $request->user()->load('membership')
            )
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request) {
        $user = $request->user();

        $data = $request->only([
            'name',
            'email'
        ]);

        if ($request->filled('password')) {
            $data['password'] = Hash::make(
                $request->password
            );
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new UserResource(
                $user->load('membership')
            )
        ]);
    }
}