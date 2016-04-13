<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Response;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    private $status;
    private $msg;
    private $data;

    public function __construct()
    {
        $this->status = 200;
        $this->msg = "OK";
        $this->data = null;
    }

    public function result($status, $msg, &$data)
    {
        $this->status = $status;
        $this->msg = $msg;
        $this->data = $data;
    }

    private function out()
    {
        return response()->json([
            'status' => $this->status,
            'message' => $this->msg,
            'data' => $this->data
        ]);
    }

    public function __destruct()
    {
        return $this->out();
    }
}