<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Response;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    public function result(&$data=null)
    {
        return response()->json([
            'status' => 200,
            'message' => "OK",
            'data' => $data
        ]);
    }
}