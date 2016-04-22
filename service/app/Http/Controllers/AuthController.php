<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

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
    private function send_reset_mail($mail, $token)
    {
        $subject = '重设Follow3密码';
        $message = file_get_contents('reset_password.html');
        $message = str_replace('RESET_TOKEN', $token, $message);
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
            . 'Content-type: text/html; charset=utf-8' . "\r\n"
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
        Cache::put('refresh_token:' . $refresh_token, $user_id, 60*24*30);
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
        $user_id = Cache::pull('refresh_token:' . $refresh_token);
        $result = $this->oauth2($user_id);
        return $this->result($result);
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
        $v = Validator::make($request->all(), [
            'email' => 'required|email|exists:User,email'
        ]);
        if ($v->fails()) {
            abort(999, $v->errors());
        }
        $mail = $request->input('email');
        $reset_token = str_random(32);
        $reset_info = $mail;
        $this->send_reset_mail($mail, $reset_token);
        Cache::put('reset:' . $reset_token, $reset_info, 60*24);
        return $this->result();
    }

    /**
     *
     * 确认修改密码
     *
     * @param Request $request
     * @param         $reset_token
     * @return mixed
     * @author: LuHao
     */
    public function confirm_reset_password(Request $request, $reset_token)
    {
        $v = Validator::make($request->all(), [
            'password' => 'required'
        ]);
        if ($v->fails()) {
            abort(999, $v->errors());
        }
        $reset_info = Cache::pull('reset_info:' . $reset_token);
        $user = User::where('email', $reset_info)->first();
        $user->password = $request->input('password');
        $user->save();
        $result = $this->oauth2($user->id);
        return $this->result($result);
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
        $v = Validator::make($request->all(), [
            'email' => 'required|email|unique:User,email',
            'nickname' => 'required|max:32',
            'password' => 'required'
        ]);
        if ($v->fails()) {
            abort(999, $v->errors());
        }
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
     * 激活账号
     *
     * @param $register_token
     * @return mixed
     * @author: LuHao
     */
    public function activate($register_token)
    {
        $user_info = Cache::pull('register:' . $register_token);
        if ( ! isset($user_info))
            abort(0000, 'Activation link was expired.');
        $user = new User;
        $user->email = $user_info['email'];
        $user->password = $user_info['password'];
        $user->nickname = $user_info['nickname'];
        $user->save();
        $user_id = $user->id;
        $result = $this->oauth2($user_id);
        return $this->result($result);
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
        $v = Validator::make($request->all(), [
            'email' => 'required|email|exists:User,email',
            'password' => 'required'
        ]);
        if ($v->fails()) {
            abort(212, $v->errors());
        }
        $mail = $request->input('email');
        $pass = $request->input('password');
        $user = User::where("email", "=", $mail)->first();
        if ($pass != Crypt::decrypt($user->password))
            abort(303, 'Wrong password.');
        $result = $this->oauth2($user->id);
        return $this->result($result);
    }

}
