<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;

class CoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Course::create([
            'name' => 'Yoga',
            'description' => 'Un cours relaxant pour améliorer la souplesse et la pleine conscience.',
            'instructor' => 'Sarah',
            'date' => '2026-05-25',
            'start_time' => '10:00:00',
        ]);
        Course::create([
            'name' => 'HIIT',
            'description' => 'Entraînement à haute intensité pour brûler des calories rapidement.',
            'instructor' => 'Mike',
            'date' => '2026-05-26',
            'start_time' => '18:00:00',
        ]);
    }
}
