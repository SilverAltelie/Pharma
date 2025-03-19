<?php

namespace App\Http\Controllers\User\Review;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\ReviewRequest;
use App\Services\Review\ReviewCreateService;
use App\Services\Review\ReviewDeleteService;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    //
    protected $reviewCreateService;
    protected $reviewDeleteService;

    public function __construct(ReviewCreateService $reviewCreateService, ReviewDeleteService $reviewDeleteService) {
        $this->reviewCreateService = $reviewCreateService;
        $this->reviewDeleteService = $reviewDeleteService;
    }
    public function store(ReviewRequest $request) {
        if (!Auth::check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $user = Auth::user();
        return $this->reviewCreateService->handle($request, $user->id);
    }

    public function destroy($id) {
        return $this->reviewDeleteService->handle($id);
    }
}
