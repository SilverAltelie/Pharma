<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/verify-email/{uuid}', [AuthController::class, 'verifyEmail'])
    ->middleware('signed') // Xác thực ký số
    ->name('auth.verify');

Route::get('/', function () {
    return view('welcome');
});

