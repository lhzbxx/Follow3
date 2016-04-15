<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Response;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    public function result($status=200, $msg="OK", &$data=null)
    {
        return response()->json([
            'status' => $status,
            'message' => $msg,
            'data' => $data
        ]);
    }
}