<?php
/**
 * Created by PhpStorm.
 * User: LuHao
 * Date: 16/4/19
 * Time: 下午7:20
 */

namespace App\Console\Commands;

use App\Models\Star;
use Illuminate\Console\Command;

class UpdateStar extends Command
{
    protected $signature = 'update:star';

    protected $description = 'Update all the stars\' info';

    public function handle()
    {
        $stars = Star::all();
        foreach ($stars as $star) {
            $id = $star->id;
            $platform = $star->platform;
            if ($platform === "PANDA")
                $this->panda($id);
            if ($platform === "DOUYU")
                $this->douyu($id);
        }
    }

    /**
     *
     * 熊猫
     *
     * @param $id
     * @return mixed
     * @author: LuHao
     */
    private function panda($id)
    {
        $star = Star::find($id);
        $url = 'http://api.m.panda.tv/ajax_get_liveroom_baseinfo?roomid='
            . $star->serial . '&slaveflag=1&type=json&__version=1.0.0.1172&__plat=android';
        $result = json_decode(file_get_contents($url));
        $star->nickname = $result->data->info->hostinfo->name;
        $star->title = $result->data->info->roominfo->name;
        $star->avatar = $result->data->info->hostinfo->avatar;
        $star->cover = $result->data->info->roominfo->pictures->img;
        $star->is_live = $result->data->info->videoinfo->status == 2;
        $star->save();
    }

    /**
     *
     * 火猫
     *
     * @param $id
     * @return mixed
     * @author: LuHao
     */
    private function huomao($id)
    {
        $url = 'http://api.huomaotv.cn/index.php?m=api&c=android&a=get_live&cid='
            . $id . '&gid=17&t=a&time=1460390807&token=153b1b37c0ebe21fe97e092a8fd39fe4&tt=a&uid=null';
        $result = json_decode(file_get_contents($url));
        if ($result->errno === 0) {
            Star::create([
                'nickname' => $result->data->info->hostinfo->name,
                'platform' => 'PANDA',
                'serial' => $id,
                'title' => $result->data->info->roominfo->name,
                'avatar' => $result->data->info->hostinfo->avatar,
                'cover' => $result->data->info->roominfo->pictures->img,
                'is_live' => $result->data->info->videoinfo->status === 2,
            ]);
        } else {
            abort(123213, 'Platform response error!');
        }
        return $result;
    }

//    private function longzhu($id)
//    {
//        $url = 'http://www.quanmin.tv/json/rooms/' . $id . '/info.json';
//    }

    /**
     *
     * 全民
     *
     * @param $id
     * @return mixed
     * @author: LuHao
     */
    private function quanmin($id)
    {
        $url = 'http://www.quanmin.tv/json/rooms/' . $id . '/info.json';
        $result = json_decode(file_get_contents($url));
        if ($result->errno === 0) {
            Star::create([
                'nickname' => $result->data->info->hostinfo->name,
                'platform' => 'PANDA',
                'serial' => $id,
                'title' => $result->data->info->roominfo->name,
                'avatar' => $result->data->info->hostinfo->avatar,
                'cover' => $result->data->info->roominfo->pictures->img
            ]);
        } else {
            abort(123213, 'Platform response error!');
        }
        return $result;
    }

    /**
     *
     * 斗鱼
     *
     * @param $id
     * @return mixed
     * @author: LuHao
     */
    private function douyu($id)
    {
        $star = Star::find($id);
        $url = 'room/' . $id . '?aid=android&client_sys=android&time=' . time();
        $auth = md5($url . '1231');
        $url =  'http://www.douyu.com/api/v1/' . $url . '&auth=' . $auth;
        $result = json_decode(file_get_contents($url));
        $star->nickname = $result->data->nickname;
        $star->title = $result->data->room_name;
        $star->avatar = $result->data->owner_avatar;
        $star->cover = $result->data->room_src;
        $star->is_live = $result->data->show_status == 1;
        $star->save();
    }

    /**
     *
     * 战旗
     *
     * @param $id
     * @return mixed
     * @author: LuHao
     */
    private function zhanqi($id)
    {
        $url = 'http://www.zhanqi.tv/api/static/live.roomid/' . $id . '.json';
        $result = json_decode(file_get_contents($url));
        if ($result->errno === 0) {
            Star::create([
                'nickname' => $result->data->info->hostinfo->name,
                'platform' => 'PANDA',
                'serial' => $id,
                'title' => $result->data->info->roominfo->name,
                'avatar' => $result->data->info->hostinfo->avatar,
                'cover' => $result->data->info->roominfo->pictures->img
            ]);
        } else {
            abort(123213, 'Platform response error!');
        }
        return $result;
    }
}