<?php
/**
 * Created by PhpStorm.
 * User: LuHao
 * Date: 16/4/19
 * Time: 下午7:20
 */

namespace App\Console\Commands;

use App\Jobs\SendNotify;
use App\Models\Star;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;

class UpdateStar extends Command
{
    protected $signature = 'update:star';

    protected $description = 'Update all the stars\' info';

    /**
     *
     * 检查所有的主播状态
     *
     * @author: LuHao
     */
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
     * 检查是否发送通知
     *
     * @param $old_status
     * @param $new_status
     * @param $star_id
     * @return bool
     * @author: LuHao
     */
    private function notify($old_status, $new_status, $star_id)
    {
        if ( ! $old_status and $new_status) {
            Queue::push(new SendNotify($star_id));
            Log::info('Send notify with STAR: ' . $star_id . '.');
            return true;
        }
        return false;
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
//        $result = $this->result($url, 'panda');
        $star->nickname = $result->data->info->hostinfo->name;
        $star->title = $result->data->info->roominfo->name;
        $star->avatar = $result->data->info->hostinfo->avatar;
        $star->cover = $result->data->info->roominfo->pictures->img;
        if ($this->notify($star->is_live, $result->data->info->videoinfo->status == 2, $id))
            $star->began_at = date("Y-m-d H:i:s");
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
//        $result = $this->result($url, 'quanmin');
        $star->nickname = $result->nick;
        $star->title = $result->title;
        $star->avatar = $result->avatar;
        if (isset($result->thumb))
            $star->cover = $result->thumb;
        if ($this->notify($star->is_live, $result->play_status, $id))
            $star->began_at = date("Y-m-d H:i:s");
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
        $result = $this->result($url, 'douyu');
        if ( ! $result)
            return;
        $star->nickname = $result->data->nickname;
        $star->title = $result->data->room_name;
        $star->avatar = $result->data->owner_avatar;
        $star->cover = $result->data->room_src;
        if ($this->notify($star->is_live, $result->data->show_status == 1, $id))
            $star->began_at = date("Y-m-d H:i:s");
        $star->is_live = $result->data->show_status == 1;
        $star->save();
    }

    /**
     *
     * CURL方式获取数据
     *
     * @param $url
     * @param $platform
     * @return int
     * @author: LuHao
     */
    private function result($url, $platform)
    {
        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($curl);
        if ( ! ($result && curl_getinfo($curl, CURLINFO_HTTP_CODE) == 200)) {
            Cache::increment('update:' . $platform . ':fail');
            echo $result;
            return false;
        }
        curl_close($curl);
        $result = json_decode($result);
        if ( ! $result) {
            Cache::increment('update:' . $platform . ':fail');
            echo $result;
            return false;
        }
        Cache::increment('update:' . $platform . ':success');
        return $result;
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
//        $result = $this->result($url, 'zhanqi');
        $star->nickname = $result->data->nickname;
        $star->title = $result->data->title;
        $star->avatar = $result->data->avatar;
        $star->cover = $result->data->spic;
        if ($this->notify($star->is_live, $result->data->status == 4, $id))
            $star->began_at = date("Y-m-d H:i:s");
        $star->is_live = $result->data->status == 4;
        $star->save();
    }

}