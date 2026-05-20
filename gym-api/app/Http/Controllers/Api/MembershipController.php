<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MembershipResource;
use App\Models\Membership;
use App\Models\User;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function assignMembership(
        Request $request,
        $userId
    ) {

        $request->validate([
            'status' =>
                'required|in:active,not_active',

            'start_date' =>
                'nullable|date',

            'end_date' =>
                'nullable|date|after:start_date',
        ]);

        $user = User::findOrFail($userId);

        $membership = Membership::updateOrCreate(
            ['user_id' => $userId],
            [
                'status' => $request->status,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]
        );

        $user->update([
            'membership_status' => $request->status
        ]);

        return response()->json([
            'message' =>
                'Membership assigned successfully',

            'membership' =>
                new MembershipResource($membership)
        ]);
    }

    public function updateMembership(
        Request $request,
        $userId
    ) {

        $request->validate([
            'status' =>
                'sometimes|in:active,not_active',

            'start_date' =>
                'nullable|date',

            'end_date' =>
                'nullable|date|after:start_date',
        ]);

        $user = User::findOrFail($userId);

        $membership = Membership::where(
            'user_id',
            $userId
        )->firstOrFail();

        $membership->update(
            $request->only([
                'status',
                'start_date',
                'end_date'
            ])
        );

        if ($request->filled('status')) {

            $user->update([
                'membership_status' =>
                    $request->status
            ]);
        }

        return response()->json([
            'message' =>
                'Membership updated successfully',

            'membership' =>
                new MembershipResource($membership)
        ]);
    }
}