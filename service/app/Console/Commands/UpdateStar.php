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

    protected $description = 'Update all the stars\' info.';

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
     * 检查是否发送通知并记录上线和下线时间
     *
     * @param $new_status
     * @param $star
     * @return bool
     * @author: LuHao
     */
    private function notifyAndRecord($new_status, &$star)
    {
        $old_status = $star->is_live;
        if ( ! $old_status and $new_status) {
            Queue::push(new SendNotify($star->id));
            Log::info('Send notify with STAR: ' . $star->id . '.');
            $star->began_at = date("Y-m-d H:i:s");
        } else if ( ! $new_status and $old_status) {
            $star->end_at = date("Y-m-d H:i:s");
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
//        $result = $this->result($url, 'panda');
        $star->nickname = $result->data->info->hostinfo->name;
        $star->title = $result->data->info->roominfo->name;
        $avatar = $result->data->info->hostinfo->avatar;
        $star->avatar = substr($avatar, 0, 17) . '/dmfd/200_200_100/' . substr($avatar, 18);
        $star->cover = $result->data->info->roominfo->pictures->img;
        $this->notifyAndRecord($result->data->info->videoinfo->status == 2, $star);
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
        $this->notifyAndRecord($result->play_status, $star);
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
//        $result = json_decode(file_get_contents($url));
        if ( ! $result)
            return;
        $star->nickname = $result->data->nickname;
        $star->title = $result->data->room_name;
        $star->avatar = $result->data->owner_avatar;
        $star->cover = $result->data->room_src;
        $this->notifyAndRecord($result->data->show_status == 1, $star);
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
        curl_setopt($curl, CURLOPT_USERAGENT, str_random(8));
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
        $star->avatar = $result->data->avatar . '-medium';
        $star->cover = $result->data->spic;
        $this->notifyAndRecord($result->data->status == 4, $star);
        $star->is_live = $result->data->status == 4;
        $star->save();
    }

}