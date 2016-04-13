<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

class AuthController extends Controller
{

    private function postfix($mail, $nickname)
    {
        $subject = '欢迎使用Follow3';
        $message = file_get_contents('activate.html');
        $message = str_replace('USER_NAME', $nickname, $message);
        $message = wordwrap($message, 70, "\r\n");
        $headers = "MIME-Version: 1.0" . "\r\n"
            . 'Content-type: text/html; charset=iso-8859-1' . "\r\n"
            . 'From: Follow3@lhzbxx.top' . "\r\n"
            . 'X-Mailer: PHP/' . phpversion();
        mail($mail, $subject, $message, $headers);
    }

    public function register(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email|unique:User',
        ], array('required'=>123, 'email'=>'not email'));
        $mail = $request->input('email');
        $nickname = $request->input('nickname');
        $pass = $request->input('password');
        $this->postfix($mail, $nickname);
        $register_token = str_random(32);
        $register_info = array(
            'email' => $mail,
            'password' => Crypt::encrypt($pass),
            'nickname' => $nickname
        );
        Cache::put('$register:' . $register_token, $register_info, 24*60);
    }

    public function login($mail, $pass)
    {

    }

    public function refresh_token($refresh_token)
    {

    }

}
