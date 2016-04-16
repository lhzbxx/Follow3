<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $table = 'Follow';

    public function scopeIsExist($query, $user_id, $star_id) {
        return $query->where('star_id', $star_id)
            ->where('user_id', $user_id)
            ->first();
    }
}