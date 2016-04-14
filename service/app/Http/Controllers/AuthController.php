<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

class AuthController extends Controller
{

    /**
     *
     * 发送激活邮件
     *
     * @param $mail
     * @param $nickname
     * @author: LuHao
     */
    private function send_activate_mail($mail, $nickname, $token)
    {
        $subject = '欢迎使用Follow3';
        $message = file_get_contents('activate_account.html');
        $message = str_replace('USER_NAME', $nickname, $message);
        $message = str_replace('REGISTER_TOKEN', $token, $message);
        $this->send_mail($subject, $mail, $message);
    }

    /**
     *
     * 发送重设密码邮件
     *
     * @param $mail
     * @author: LuHao
     */
    private function send_reset_mail($mail)
    {
        $subject = '重设Follow3密码';
        $message = file_get_contents('reset_password.html');
        $this->send_mail($subject, $mail, $message);
    }

    /**
     *
     * 发送邮件
     *
     * @param $subject
     * @param $mail
     * @param $message
     * @author: LuHao
     */
    private function send_mail($subject, $mail, &$message)
    {
        $message = wordwrap($message, 70, "\r\n");
        $headers = "MIME-Version: 1.0" . "\r\n"
            . 'Content-type: text/html; charset=iso-8859-1' . "\r\n"
            . 'From: Follow3@lhzbxx.top' . "\r\n"
            . 'X-Mailer: PHP/' . phpversion();
        mail($mail, $subject, $message, $headers);
    }

    /**
     *
     * 生成access_token
     *
     * @param $user_id
     * @return mixed
     * @author: LuHao
     */
    private function generate_access_token($user_id)
    {
        $access_token = str_random(16);
        Cache::put('access_token:' . $access_token, $user_id, 60*24*30);
        return $access_token;
    }

    /**
     *
     * 生成refresh_token
     *
     * @param $user_id
     * @author: LuHao
     */
    private function generate_refresh_token($user_id)
    {
        $refresh_token = str_random(16);
        Cache::put('access_token:' . $refresh_token, $user_id, 60*24*30);
        return $refresh_token;
    }

    /**
     *
     * 刷新access_token
     *
     * @param $refresh_token
     * @return mixed
     * @author: LuHao
     */
    public function refresh_access_token($refresh_token)
    {
        $user_id = Cache::get('refresh_token:' . $refresh_token);
        return $this->generate_access_token($user_id);
    }

    /**
     *
     * 重设账号密码
     *
     * @param Request $request
     * @author: LuHao
     */
    public function reset_password(Request $request)
    {
        
    }

    /**
     *
     * 激活账号
     *
     * @param $register_token
     * @return mixed
     * @author: LuHao
     */
    public function activate($register_token)
    {
        $user_info = Cache::get('register:' . $register_token);
        $user_id = User::create([
            'email' => $user_info['email'],
            'password' => $user_info['password'],
            'nickname' => $user_info['nickname']

        ]);
        $result = $this->oauth2($user_id);
        return $this->result(200, "OK", $result);
    }

    /**
     *
     * OAuth2.0
     *
     * @param $user_id
     * @return array
     * @author: LuHao
     */
    private function oauth2($user_id)
    {
        $access_token = $this->generate_access_token($user_id);
        $refresh_token = $this->generate_refresh_token($user_id);
        $result = array(
            'access_token' => $access_token,
            'refresh_token' => $refresh_token
        );
        return $result;
    }

    /**
     *
     * 用户注册
     *
     * @param Request $request
     * @return mixed
     * @author: LuHao
     */
    public function register(Request $request)
    {
        $mail = $request->input('email');
        $nickname = $request->input('nickname');
        $pass = $request->input('password');
        $register_token = str_random(32);
        $register_info = array(
            'email' => $mail,
            'password' => Crypt::encrypt($pass),
            'nickname' => $nickname
        );
        $this->send_activate_mail($mail, $nickname, $register_token);
        Cache::put('register:' . $register_token, $register_info, 60*24);
        return $this->result();
    }

    /**
     *
     * 用户登录
     *
     * @param Request $request
     * @return mixed
     * @author: LuHao
     */
    public function login(Request $request)
    {
        return $this->result();
    }

}
