<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use Illuminate\Support\Facades\Crypt;

class GeneralController extends Controller
{

    /**
     *
     * 取消邮件订阅
     *
     * @param $user_id
     * @param $star_id
     * @return string
     * @author: LuHao
     */
    public function unsubscribe($user_id, $star_id)
    {
        $user_id = Crypt::decrypt($user_id);
        $star_id = Crypt::decrypt($star_id);
        $follow = Follow::where('user_id', $user_id)
            ->where('star_id', $star_id)
            ->first();
        if (!$follow) {
            return "You're not following this star!";
        }
        $follow->is_notify = false;
        $follow->save();
        return "Unsubscribe success!";
    }

}
