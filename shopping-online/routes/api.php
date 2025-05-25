<?php

use App\Http\Controllers\Address\AddressController;
use App\Http\Controllers\Admin\Permission\PermissionController;
use App\Http\Controllers\Admin\Role\RoleController;
use App\Http\Controllers\User\HomeController as UserHomeController;
use App\Http\Controllers\User\MainController;
use App\Http\Controllers\User\Review\ReviewController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\Category\CategoryController;
use App\Http\Controllers\Admin\Product\ProductController;
use App\Http\Controllers\User\Order\OrderController as UserOrderController;
use App\Http\Controllers\Admin\Order\OrderController;
use App\Http\Controllers\User\Category\CategoryController as UserCategoryController;
use App\Http\Controllers\User\Product\ProductController as UserProductController;
use \App\Http\Controllers\Admin\Promotion\PromotionController;
use \App\Http\Controllers\Admin\Blog\BlogController;
use \App\Http\Controllers\Admin\BlogCategory\BlogCategoryController;
use \App\Http\Controllers\Admin\Variant\VariantController;
use App\Http\Controllers\Admin\AdminController;
use \App\Http\Controllers\User\Cart\CartController;
use \App\Http\Controllers\Admin\User\UserController;
use \App\Http\Controllers\Admin\HomeController;
use \App\Http\Controllers\BankWebhookController;
use App\Http\Controllers\User\Blog\BlogController as UserBlogController;

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
    Route::post('login', [AuthController::class, 'login'])->name('login');

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
    Route::get('/home', [UserHomeController::class, 'index']);
    Route::get('/main', [MainController::class, 'index']);
    Route::get('/categories', [UserCategoryController::class, 'index']);
    Route::get('/product', [ProductController::class, 'index']);
    Route::get('/products', [UserProductController::class, 'index']);
    Route::get('/products/{id}', [UserProductController::class, 'show']);
    
    // Test route to check products
    Route::get('/test-products', function() {
        $products = \App\Models\Product::with('images')->get();
        return response()->json([
            'total_products' => $products->count(),
            'products' => $products->take(5) // Show first 5 products
        ]);
    });
    
    Route::prefix('/category')->group(function () {
        Route::get('/{id}', [UserCategoryController::class, 'show']);
    });

    Route::prefix('/cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::get('/getProduct', [CartController::class, 'getProductCart']);
        Route::post('/addProduct', [CartController::class, 'addProductToCart']);
        Route::post('/removeProduct', [CartController::class, 'deleteProductFromCart']);
        Route::post('/updateQuantity', [CartController::class, 'updateQuantity']);
        Route::post('/updateAllQuantity', [CartController::class, 'updateAllQuantity']);
    });

    Route::prefix('/product')->group(function () {
        Route::get('/show/{id}', [UserProductController::class, 'show']);
        Route::get('/relateProduct/{id}', [UserProductController::class, 'getRelate']);
        Route::post('/updateRelate', [UserProductController::class, 'updateRelate']);
    });

    Route::prefix('/order')->group(function () {
        Route::get('/', [UserOrderController::class, 'index']);
        Route::get('/checkout', [UserOrderController::class, 'checkout']);
        Route::post('/create', [UserOrderController::class, 'store']);
    });

    // Blog routes
    Route::get('/blogs', [UserBlogController::class, 'index']);
    Route::get('/blogs/{id}', [UserBlogController::class, 'show']);
});

Route::post('/bank/webhook', [BankWebhookController::class, 'receiveTransaction']);

Route::get('/orders/{id}', [UserOrderController::class, 'show']);


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
    Route::prefix('/orders')->group(function () {
        Route::get('/', [UserOrderController::class, 'index']);
        Route::get('/checkout', [UserOrderController::class, 'checkout']);
        Route::get('/show/{id}', [UserOrderController::class, 'show']);
        Route::post('/create', [UserOrderController::class, 'store']);
    });
});

Route::prefix('/admin/auth')->group(function () {
    Route::post('/login', [AdminController::class, 'login']);
    Route::post('/register', [AdminController::class, 'register']);
});

Route::post('/mock-bank/webhook', [BankWebhookController::class, 'simulate']);


Route::prefix('admin')->middleware('admin.auth')->group(function () {

    Route::get('/dashboard', [HomeController::class, 'dashboard']);
    Route::get('/home', [HomeController::class, 'layout']);
    Route::post('/logout', [AdminController::class, 'logout']);

    Route::prefix('/category')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::post('/create', [CategoryController::class, 'store']);
        Route::post('/update/{id}', [CategoryController::class, 'update']);
        Route::post('/delete/{id}', [CategoryController::class, 'destroy']);
    });

    Route::prefix('/permissions')->group(function () {
        Route::get('/', [PermissionController::class, 'index']);
        Route::post('/create', [PermissionController::class, 'store']);
        Route::post('/update/{id}', [PermissionController::class, 'update']);
        Route::post('/delete/{id}', [PermissionController::class, 'destroy']);
    });

    Route::prefix('/roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::post('/create', [RoleController::class, 'store']);
        Route::post('/update/{id}', [RoleController::class, 'update']);
        Route::post('/delete/{id}', [RoleController::class, 'destroy']);
        Route::post('/addPermission/{id}', [RoleController::class, 'addPermission']);
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

    Route::prefix('/orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/updateStatus/{id}', [OrderController::class, 'updateOrderStatus']);
    });

    Route::prefix('/users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/create', [UserController::class, 'store']);
        Route::get('/edit/{id}', [UserController::class, 'edit']);
        Route::post('/update/{id}', [UserController::class, 'update']);
        Route::post('/delete/{id}', [UserController::class, 'destroy']);
    });

    Route::prefix('permissions')->group(function () {
        Route::get('/', [PermissionController::class, 'index']);
        Route::post('/create', [PermissionController::class, 'store']);
        Route::get('/edit/{id}', [PermissionController::class, 'edit']);
        Route::post('/update/{id}', [PermissionController::class, 'update']);
        Route::post('/delete/{id}', [PermissionController::class, 'destroy']);
    });

    Route::prefix('/promotions')->group(function () {
        Route::get('/', [PromotionController::class, 'index']);
        Route::post('/create', [PromotionController::class, 'store']);
        Route::get('/edit/{id}', [PromotionController::class, 'edit']);
        Route::post('/update/{id}', [PromotionController::class, 'update']);
        Route::post('/delete/{id}', [PromotionController::class, 'destroy']);
        Route::get('/getItems/{id}', [PromotionController::class, 'getItems']);
        Route::post('/addItems/{id}', [PromotionController::class, 'addItems']);
        Route::get('/show/{id}', [PromotionController::class, 'show']);
        Route::post('/removeItems/{id}', [PromotionController::class, 'removeItems']);
    });

    Route::prefix('/blogs')->group(function () {
        Route::get('/', [BlogController::class, 'index']);
        Route::post('/create', [BlogController::class, 'store']);
        Route::get('/edit/{id}', [BlogController::class, 'edit']);
        Route::post('/update/{id}', [BlogController::class, 'update']);
        Route::post('/delete/{id}', [BlogController::class, 'destroy']);
    });

    Route::prefix('/blog-categories')->group(function () {
        Route::post('/create', [BlogCategoryController::class, 'store']);
        Route::post('/update/{id}', [BlogCategoryController::class, 'update']);
        Route::post('/delete/{id}', [BlogCategoryController::class, 'destroy']);
    });

});
