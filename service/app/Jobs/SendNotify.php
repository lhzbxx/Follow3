<?php

namespace App\Jobs;

use App\Models\Follow;
use App\Models\Star;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use JPush;

class SendNotify extends Job
{
    protected $star_id;

    public function __construct($star_id)
    {
        $this->star_id = $star_id;
    }

    /**
     *
     * 向允许通知的用户发送邮件通知
     *
     * @author: LuHao
     */
    public function handle()
    {
        $star_id = $this->star_id;
        $followers = Follow::where('star_id', '=', $star_id)->get();
        $star = Star::find($star_id);
        $star_name = $star->nickname;
        $subject = $star_name . '开播啦~';
        $template = file_get_contents(dirname(__FILE__) . '/notify.html');
        $template = str_replace('WATCH_LINK', $star->link, $template);
        $template = str_replace('STAR_NAME', $star_name, $template);
        $elapse = microtime();
        foreach ($followers as $follower) {
            $user = User::find($follower->user_id);
            $user_name = $user->nickname;
            $user_id = $user->id;
            $message = str_replace('USER_NAME', $user_name, $template);
            if ($follower->is_notify)
                $this->send_mail($subject, $user->email, $message, $user_id);
            $this->send_notify($star->nickname, $user_id);
        }
        Log::info('Total time used to notify: ' . (microtime() - $elapse) . 'ms.');
    }

    /**
     *
     * 发送邮件
     *
     * @param $subject
     * @param $mail
     * @param $message
     * @param $user_id
     * @author: LuHao
     */
    private function send_mail($subject, $mail, &$message, $user_id)
    {
        $message = wordwrap($message, 70, "\r\n");
        $headers = "MIME-Version: 1.0" . "\r\n"
            . 'Content-type: text/html; charset=utf-8' . "\r\n"
            . 'From: Follow3@lhzbxx.top' . "\r\n"
            . 'X-Mailer: PHP/' . phpversion();
        mail($mail, $subject, $message, $headers);
        Cache::increment('service:' . 'mail:' . $user_id);
    }

    /**
     *
     * 推送通知
     *
     * @param $nickname
     * @param $user_id
     * @author: LuHao
     */
    private function send_notify($nickname, $user_id)
    {
        $client = new JPush('0aefd58ed167584a6d7612e7', '3fd3cffb02e92cddd17205c2');
        $result = $client->device()
            ->getAliasDevices('JPush_' . $user_id);
        if ($result->data->registration_ids) {
            $client->push()
                ->setPlatform('all')
                ->addAlias('JPush_' . $user_id)
                ->setNotificationAlert($nickname . '开播啦~~~')
                ->send();
        }
    }
}
