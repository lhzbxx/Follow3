<?php

namespace App\Http\Controllers;

class UserController extends BaseController
{

    public function __construct()
    {
        $this->middleware('Authenticate');
    }

    public function profile($id)
    {
        return 'false';
    }

}
