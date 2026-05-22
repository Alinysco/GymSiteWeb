<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'cours';

    protected $fillable = [
        'name',
        'description',
        'instructor',
        'date',
        'start_time',
    ];
}
