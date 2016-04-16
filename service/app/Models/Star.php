<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Star extends Model
{
    protected $table = 'Star';
    
    public function scopeIsExist($query, $platform, $serial) {
        return $query->where('platform', $platform)
            ->where('serial', $serial)
            ->first();
    }
}