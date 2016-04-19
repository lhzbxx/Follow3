<?php

namespace App\Http\Controllers;

use App\Models\Star;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StarController extends Controller
{

    public function add(Request $request)
    {
        $v = Validator::make($request->all(), [
            'query' => 'required',
            'platform' => 'required|in:PANDA,QUANMIN,DOUYU,ZHANQI'
        ]);
        if ($v->fails()) {
            abort(89293, $v->errors());
        }
    }

    /**
     *
     * 查询主播
     *
     * @param Request $request
     * @return mixed
     * @author: LuHao
     */
    public function search(Request $request)
    {
        $v = Validator::make($request->all(), [
            'query' => 'required',
            'platform' => 'required|in:PANDA,QUANMIN,DOUYU,ZHANQI'
        ]);
        if ($v->fails()) {
            abort(999, $v->errors());
        }
        $query = $request->input('query');
        $platform = $request->input('platform');
        if ( ! ((int)$query === 0)) {
            $data = $this->search_with_id($query, $platform);
        } else {
            $data = $this->search_with_nickname($query, $platform);
        }
        return $this->result($data);
    }

    /**
     *
     * 查询主播(根据ID)
     *
     * @param $serial
     * @param $platform
     * @return string
     * @author: LuHao
     */
    public function search_with_id($serial, $platform)
    {
        $star = Star::isSerialExist($platform, $serial);
        if ( ! isset($star))
            return json_encode($star);
        $r = "No star and platform found!";
        if ($platform === "PANDA")
            $r = $this->panda($serial);
        if ($platform === "QUANMIN")
            $r = $this->quanmin($serial);
        if ($platform === "DOUYU")
            $r = $this->douyu($serial);
        if ($platform === "ZHANQI")
            $r = $this->zhanqi($serial);
        return $r;
    }

    /**
     *
     * 查询主播(根据昵称)
     *
     * @param $nickname
     * @param $platform
     * @return mixed
     * @author: LuHao
     */
    public function search_with_nickname($nickname, $platform)
    {
        $star = Star::isNicknameExist($platform, $nickname);
        if ( ! isset($star)) {
            return json_encode($star);
        }
        else  {
            $r = "No star and platform found!";
            if ($platform === "QUANMIN")
                $r = $this->quanmin($nickname);
            if ($platform === "DOUYU")
                $r = $this->douyu($nickname);
            if ($platform === "ZHANQI")
                $r = $this->zhanqi($nickname);
            return $r;
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
        $url = 'http://api.m.panda.tv/ajax_get_liveroom_baseinfo?roomid='
            . $id . '&slaveflag=1&type=json&__version=1.0.0.1172&__plat=android';
        $result = json_decode(file_get_contents($url));
        if ($result->errno === 0) {
            $star = new Star;
            $star->nickname = $result->data->info->hostinfo->name;
            $star->platform = 'PANDA';
            $star->serial = $result->data->info->roominfo->id;
            $star->title = $result->data->info->roominfo->name;
            $star->avatar = $result->data->info->hostinfo->avatar;
            $star->cover = $result->data->info->roominfo->pictures->img;
            $star->is_live = $result->data->info->videoinfo->status == 2;
            $star->save();
        } else {
            abort(123213, 'Platform response error!');
        }
        return $result;
    }

//    /**
//     *
//     * 火猫
//     *
//     * @param $id
//     * @return mixed
//     * @author: LuHao
//     */
//    private function huomao($id)
//    {
//        $url = 'http://api.huomaotv.cn/index.php?m=api&c=android&a=get_live&cid='
//            . $id . '&gid=17&t=a&time=1460390807&token=153b1b37c0ebe21fe97e092a8fd39fe4&tt=a&uid=null';
//        $result = json_decode(file_get_contents($url));
//        if ($result->errno === 0) {
//            $star = new Star;
//            $star->nickname = $result->nick;
//            $star->platform = 'QUANMIN';
//            $star->serial = $result->uid;
//            $star->title = $result->title;
//            $star->avatar = $result->avatar;
//            if (isset($result->thumb))
//                $star->cover = $result->thumb;
//            $star->is_live = $result->play_status;
//            $star->save();
//        } else {
//            abort(123213, 'Platform response error!');
//        }
//        return $result;
//    }

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
        if ( ! empty($result)) {
            $star = new Star;
            $star->nickname = $result->nick;
            $star->platform = 'QUANMIN';
            $star->serial = $result->uid;
            $star->title = $result->title;
            $star->avatar = $result->avatar;
            if (isset($result->thumb))
                $star->cover = $result->thumb;
            $star->is_live = $result->play_status;
            $star->save();
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
        $url = 'room/' . $id . '?aid=android&client_sys=android&time=' . time();
        $auth = md5($url . '1231');
        $url =  'http://www.douyu.com/api/v1/' . $url . '&auth=' . $auth;
        $result = json_decode(file_get_contents($url));
        if ($result->error === 0) {
            $star = new Star;
            $star->nickname = $result->data->nickname;
            $star->platform = 'DOUYU';
            $star->title = $result->data->room_name;
            $star->avatar = $result->data->owner_avatar;
            $star->cover = $result->data->room_src;
            $star->is_live = $result->data->show_status == 1;
            $star->serial = $result->data->room_id;
            $star->save();
        } else {
            abort(123213, 'Platform response error!');
        }
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
        $url = 'http://www.zhanqi.tv/api/static/live.domain/' . $id . '.json';
        $result = json_decode(file_get_contents($url));
        if ($result->code === 0) {
            $star = new Star;
            $star->nickname = $result->data->nickname;
            $star->platform = 'ZHANQI';
            $star->title = $result->data->title;
            $star->avatar = $result->data->avatar;
            $star->cover = $result->data->spic;
            $star->is_live = $result->data->status == 4;
            $star->serial = $result->data->code;
            $star->save();
        } else {
            abort(123213, 'Platform response error!');
        }
        return $result;
    }
}
