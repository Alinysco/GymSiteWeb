<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MembershipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,

            'start_date' =>
                $this->start_date?->toDateString(),

            'end_date' =>
                $this->end_date?->toDateString(),

            'created_at' =>
                $this->created_at?->toDateTimeString(),

            'updated_at' =>
                $this->updated_at?->toDateTimeString(),
        ];
    }
}