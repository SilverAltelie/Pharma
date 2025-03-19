<?php

use App\Http\Controllers\Address\AddressController;
use App\Http\Controllers\User\HomeController;
use App\Http\Controllers\User\MainController;
use App\Http\Controllers\User\Review\ReviewController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\Category\CategoryController;
use App\Http\Controllers\Admin\Product\ProductController;
use App\Http\Controllers\User\Product\ProductController as UserProductController;
use App\Http\Controllers\User\Order\OrderController;

use \App\Http\Controllers\Admin\Variant\VariantController;
use App\Http\Controllers\Admin\AdminController;
use \App\Http\Controllers\User\Cart\CartController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/
Route::prefix('/')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::post('register', [AuthController::class, 'register']);

    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('/email/verify/{id}', function (Request $request, $id) {
        if (!$request->hasValidSignature()) {
            return response()->json(['error' => 'Liên kết không hợp lệ hoặc đã hết hạn'], 400);
        }

        $user = User::findOrFail($id);
        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email đã được xác nhận trước đó.']);
        }

        $user->email_verified_at = now();
        $user->save();

        return response()->json(['message' => 'Email đã được xác nhận thành công!']);
    })->name('auth.verify');

    Route::post('/forgot-password', [AuthController::class, 'sendResetLink']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);


});

Route::prefix('')->middleware('optional-auth')->group(function () {

    Route::get('/home', [HomeController::class, 'index']);
    Route::get('/main', [MainController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/product', [ProductController::class, 'index']);
    Route::get('/products', [UserProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::prefix('/category')->group(function () {
        Route::get('/{id}', [CategoryController::class, 'show']);
    });

    Route::prefix('/cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::get('/getProduct', [CartController::class, 'getProductCart']);
        Route::post('/addProduct', [CartController::class, 'addProductToCart']);
        Route::post('/removeProduct', [CartController::class, 'deleteProductFromCart']);
        Route::post('/updateQuantity', [CartController::class, 'updateQuantity']);
        Route::post('/checkout', [CartController::class, 'checkout']);
    });
    Route::get('/product/show/{id}', [ProductController::class, 'show']);

    Route::prefix('/order')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
    });
});

Route::prefix('')->middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::prefix('/addresses')->group(function () {
        Route::get('/', [AddressController::class, 'index']);
        Route::get('/{id}', [AddressController::class, 'show']);
        Route::post('/create', [AddressController::class, 'store']);
        Route::post('/update/{id}', [AddressController::class, 'update']);
        Route::post('/delete/{id}', [AddressController::class, 'destroy']);
        Route::post('/setDefault/{id}', [AddressController::class, 'setDefault']);
    });
    Route::post('/reviews/create', [ReviewController::class, 'store']);
});

Route::prefix('admin')->group(function () {

    Route::prefix('/auth')->group(function () {
        Route::post('/login', [AdminController::class, 'login']);
        Route::post('/register', [AdminController::class, 'register']);
    });

    Route::prefix('/category')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/create', [CategoryController::class, 'store']);
        Route::post('/update/{id}', [CategoryController::class, 'update']);
        Route::post('/delete/{id}', [CategoryController::class, 'destroy']);
    });

    Route::prefix('/product')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::post('/create', [ProductController::class, 'store']);
        Route::get('/edit/{id}', [ProductController::class, 'edit']);
        Route::post('/update/{id}', [ProductController::class, 'update']);
        Route::post('/delete/{id}', [ProductController::class, 'destroy']);
        Route::get('/show/{id}', [ProductController::class, 'show']);
    });

    Route::prefix('/variants')->group(function () {
        Route::post('/create', [VariantController::class, 'store']);
        Route::post('/update/{id}', [VariantController::class, 'update']);
        Route::post('/delete/{id}', [VariantController::class, 'destroy']);
    });

    Route::post('/reviews/delete/{id}', [ReviewController::class, 'destroy']);

});
