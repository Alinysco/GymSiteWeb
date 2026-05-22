<?php

namespace App\Http\Controllers\Api;

use App\Models\Course;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Resources\CourseResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    public function index()
    {
        $cours = Course::orderBy('date')
            ->orderBy('start_time')
            ->get();
        return response()->json([
            'cours' =>
            CourseResource::collection($cours)
        ]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'name' =>
                'required|string|max:255',

            'instructor' =>
                'required|string|max:255',

            'description' =>
                'nullable|string',

            'date' =>
                'required|date',

            'start_time' => [
                'required',

                Rule::unique('cours')
                    ->where(function ($query) use ($request) {

            return $query->where('date', $request->date);
                }),
            ],

        ]);

        if ($validator->fails()) {

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $cours = Course::create(
            $validator->validated()
        );

        return response()->json([
            'message' => 'Course created successfully',
            'cours' => new CourseResource($cours)
        ], 201);
    }
    public function destroy($id)
    {
        $cours = Course::findOrFail($id);

        $cours->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }
}
