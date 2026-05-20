<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Membership;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@gym.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'membership_status' => 'active',
        ]);

        Membership::create([
            'user_id' => $admin->id,
            'status' => 'active',
            'start_date' => now(),
            'end_date' => now()->addYear(),
        ]);
    }
}