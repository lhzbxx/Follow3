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
            if ($platform === "ZHANQI")
                $this->zhanqi($id);
            if ($platform === "QUANMIN")
                $this->quanmin($id);
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
     * 全民
     *
     * @param $id
     * @return mixed
     * @author: LuHao
     */
    private function quanmin($id)
    {
        $star = Star::find($id);
        $url = 'http://www.quanmin.tv/json/rooms/' . $star->serial . '/info.json';
        $result = json_decode(file_get_contents($url));
        $star->nickname = $result->nick;
        $star->title = $result->title;
        $star->avatar = $result->avatar;
        if (isset($result->thumb))
            $star->cover = $result->thumb;
        $star->is_live = $result->play_status;
        $star->save();
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
        $url = 'room/' . $star->serial . '?aid=android&client_sys=android&time=' . time();
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
        $star = Star::find($id);
        $url = 'http://www.zhanqi.tv/api/static/live.domain/' . $star->serial . '.json';
        $result = json_decode(file_get_contents($url));
        $star->nickname = $result->data->nickname;
        $star->title = $result->data->title;
        $star->avatar = $result->data->avatar;
        $star->cover = $result->data->spic;
        $star->is_live = $result->data->status == 4;
        $star->save();
    }
}