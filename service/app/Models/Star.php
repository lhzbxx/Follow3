<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Star extends Model
{
    protected $table = 'Star';
    
    public function scopeIsSerialExist($query, $platform, $serial) {
        return $query->where('platform', '=', $platform)
            ->where('serial', '=', $serial)
            ->first();
    }
    
    public function scopeIsNicknameExist($query, $platform, $nickname) {
        return $query->where('platform', '=', $platform)
            ->where('nickname', 'like', $nickname)
            ->get();
    }

    public function scopeSearch($query, $q) {
        return $query->where('nickname', 'like', '%' . $q . '%')
            ->orWhere('serial', '=', $q)
            ->get();
    }
}