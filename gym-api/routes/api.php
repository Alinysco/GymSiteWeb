<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MembershipController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [
    AuthController::class,
    'register'
]);

Route::post('/login', [
    AuthController::class,
    'login'
]);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Auth
    |--------------------------------------------------------------------------
    */

    Route::get('/me', [
        AuthController::class,
        'me'
    ]);

    Route::post('/logout', [
        AuthController::class,
        'logout'
    ]);

    /*
    |--------------------------------------------------------------------------
    | User Profile
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', [
        UserController::class,
        'profile'
    ]);

    Route::put('/profile', [
        UserController::class,
        'updateProfile'
    ]);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')
        ->prefix('admin')
        ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | User Management
        |--------------------------------------------------------------------------
        */

        Route::get('/users', [
            AdminController::class,
            'getUsers'
        ]);

        Route::put('/users/{id}', [
            AdminController::class,
            'updateUser'
        ]);

        Route::delete('/users/{id}', [
            AdminController::class,
            'deleteUser'
        ]);

        /*
        |--------------------------------------------------------------------------
        | Membership Activation
        |--------------------------------------------------------------------------
        */

        Route::post('/users/{id}/activate', [
            AdminController::class,
            'activateUser'
        ]);

        Route::post('/users/{id}/deactivate', [
            AdminController::class,
            'deactivateUser'
        ]);

        /*
        |--------------------------------------------------------------------------
        | Membership Management
        |--------------------------------------------------------------------------
        */

        Route::post('/memberships/{userId}', [
            MembershipController::class,
            'assignMembership'
        ]);

        Route::put('/memberships/{userId}', [
            MembershipController::class,
            'updateMembership'
        ]);
    });
});