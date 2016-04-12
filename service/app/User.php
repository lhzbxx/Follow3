<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use Authenticatable, Authorizable;

    protected $table = 'User';
    
    protected $fillable = [
        'name', 'email',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];
}
