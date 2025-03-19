<?php

namespace App\Http\Controllers\Address;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\AddressRequest;
use App\Services\Address\AddressCreateService;
use App\Services\Address\AddressDeleteService;
use App\Services\Address\AddressSetDefaultService;
use App\Services\Address\AddressUpdateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    protected $addressCreateService;
    protected $addressUpdateService;
    protected $addressDeleteService;
    protected $addressSetDefaultService;

    public function __construct(AddressCreateService $addressCreateService, AddressUpdateService $addressUpdateService, AddressDeleteService $addressDeleteService, AddressSetDefaultService $addressSetDefaultService) {
        $this->addressCreateService = $addressCreateService;
        $this->addressUpdateService = $addressUpdateService;
        $this->addressDeleteService = $addressDeleteService;
        $this->addressSetDefaultService = $addressSetDefaultService;
    }
    //
    public function index() {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $addresses = $user->addresses()->get(2);

        return response()->json([
            'addresses' => $addresses
        ]);
    }

    public function show($id) {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $address = $user->addresses()->find($id);

        if (!$address) {
            return response()->json([
                'message' => 'Address not found'
            ], 404);
        }

        return response()->json([
            'address' => $address,
            'user' => $user
        ]);
    }

    public function store(AddressRequest $request) {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        $data = $request->only(['first_name', 'last_name', 'email', 'phone', 'address', 'is_default']);

        return $this->addressCreateService->handle($data, $user);
    }

    public function update(AddressRequest $request, $id) {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return $this->addressUpdateService->handle($request, $user, $id);
    }

    public function destroy($id) {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return $this->addressDeleteService->handle($user, $id);
    }

    public function setDefault($id) {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return $this->addressSetDefaultService->handle($user, $id);
    }
}
