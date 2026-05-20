<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,

            'membership_status' =>
                $this->membership_status,

            'membership' => new MembershipResource(
                $this->whenLoaded('membership')
            ),

            'created_at' =>
                $this->created_at?->toDateTimeString(),

            'updated_at' =>
                $this->updated_at?->toDateTimeString(),
        ];
    }
}