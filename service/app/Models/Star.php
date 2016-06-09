<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Star extends Model
{
    protected $table = 'Star';
    
    public function scopeIsExist($query, $platform, $serial) {
        return $query->where('platform', '=', $platform)
            ->where('serial', '=', $serial);
    }
    
    public function scopeSearch($query, $q) {
        return $query->where('nickname', 'like', '%' . $q . '%')
            ->orWhere('serial', '=', $q)->limit(10);
    }
}