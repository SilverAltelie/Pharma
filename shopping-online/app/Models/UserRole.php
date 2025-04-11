<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $table = 'user_roles';

    protected $fillable = ['admin_id', 'role_id'];

    public function admin() {
        return $this->belongsTo(Admin::class);
    }

    public function role() {
        return $this->belongsTo(Role::class);
    }
}
