<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Membership;

class AdminController extends Controller
{
    public function getUsers()
    {
        $users = User::with('membership')->get();

        return response()->json([
            'users' => UserResource::collection($users)
        ]);
    }

    public function updateUser(
        UpdateUserRequest $request,
        $id
    ) {
        $user = User::findOrFail($id);

        $user->update($request->validated());

        return response()->json([
            'message' => 'User updated successfully',
            'user' => new UserResource(
                $user->load('membership')
            )
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json([
                'message' =>
                    'Cannot delete admin user'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    public function activateUser($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'membership_status' => 'active'
        ]);

        if ($user->membership) {

            $user->membership->update([
                'status' => 'active',
                'start_date' => now(),
                'end_date' => now()->addMonth(),
            ]);

        } else {

            Membership::create([
                'user_id' => $user->id,
                'status' => 'active',
                'start_date' => now(),
                'end_date' => now()->addMonth(),
            ]);
        }

        return response()->json([
            'message' =>
                'User membership activated successfully',

            'user' => new UserResource(
                $user->load('membership')
            )
        ]);
    }

    public function deactivateUser($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'membership_status' => 'not_active'
        ]);

        if ($user->membership) {

            $user->membership->update([
                'status' => 'not_active',
                'end_date' => now(),
            ]);
        }

        return response()->json([
            'message' =>
                'User membership deactivated successfully',

            'user' => new UserResource(
                $user->load('membership')
            )
        ]);
    }
}