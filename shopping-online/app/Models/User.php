<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids, HasApiTokens;

    protected $keyType = 'string'; // UUID là chuỗi
    public $incrementing = false;  // Tắt tăng tự động cho id

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',        // Cho phép name được gán giá trị
        'email',       // Cho phép email được gán giá trị
        'password',    // Cho phép password được gán giá trị
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function roles() {
        return $this->belongsTo(Role::class, 'user_roles');
    }

    public function reviews() {
        return $this->hasMany(Review::class, 'user_id');
    }

    public function cart() {
        return $this->hasOne(Cart::class, 'user_id');
    }

    public function addresses() {
        return $this->hasMany(Address::class, 'user_id');
    }

    public function orders() {
        return $this->hasMany(Order::class, 'user_id');
    }
}
