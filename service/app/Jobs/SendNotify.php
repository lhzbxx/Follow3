<?php

namespace App\Jobs;

use App\Models\Follow;
use App\Models\Star;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class SendNotify extends Job
{
    /**
     *
     * 向允许通知的用户发送邮件通知
     *
     * @param $star_id
     * @author: LuHao
     */
    public function handle($star_id)
    {
        $followers = Follow::where('star_id', '=', $star_id)
            ->where('is_notify', '=', true)
            ->get();
        Log::info('notify_star_id: ' . $star_id);
        $star = Star::find($star_id);
        $star_name = $star->nickname;
        $subject = $star_name . '开播啦~';
        $template = file_get_contents('notify.html');
        $template = str_replace('WATCH_LINK', $star->link, $template);
        foreach ($followers as $follower) {
            $user = User::find($follower->user_id);
            $user_name = $user->nickname;
            $message = str_replace('USER_NAME', $user_name, $template);
            $this->send_mail($subject, $user->email, $message);
        }
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
}
