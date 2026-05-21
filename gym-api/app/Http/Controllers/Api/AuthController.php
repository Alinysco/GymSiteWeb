<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Membership;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'name.required' => 'Name field is required',
            'email.required' => 'Email field is required',
            'email.email' => 'Please provide a valid email address',
            'email.unique' => 'This email is already registered',
            'password.required' => 'Password field is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.confirmed' => 'Password confirmation does not match',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'membership_status' => 'not_active',
        ]);

        Membership::create([
            'user_id' => $user->id,
            'status' => 'not_active',
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'user' => new UserResource($user->load('membership')),
            'success' => true,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'Email field is required',
            'email.email' => 'Please provide a valid email address',
            'password.required' => 'Password field is required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials',
                'errors' => [
                    'email' => ['The provided credentials are incorrect.']
                ]
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user->load('membership')),
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => new UserResource($request->user()->load('membership'))
        ], 200);
    }
}