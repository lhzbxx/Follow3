<?php

namespace App\Http\Controllers;

use App\Models\Star;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StarController extends Controller
{

    /**
     *
     * 所有在线的主播
     *
     * @param $page
     * @author: LuHao
     */
    public function online($page)
    {
        $result = Star::where('is_live', '=', true)
            ->orderBy('began_at', 'desc')
            ->limit(10)
            ->offset(10 * $page)
            ->get();
        return $this->result($result);
    }

    /**
     *
     * 热门主播
     *
     * @param $page
     * @author: LuHao
     */
    public function hot($page)
    {
        $result = Star::orderBy('followers', 'desc')
            ->limit(10)
            ->offset(10 * $page)
            ->get();
        return $this->result($result);
    }

    /**
     *
     * 添加主播
     *
     * @param $request
     * @return string
     * @author: LuHao
     */
    public function add(Request $request)
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
        if ($platform === "PANDA")
            $r = $this->panda($query);
        if ($platform === "QUANMIN")
            $r = $this->quanmin($query);
        if ($platform === "DOUYU")
            $r = $this->douyu($query);
        if ($platform === "ZHANQI")
            $r = $this->zhanqi($query);
        return $this->result($r);
    }

    /**
     *
     * 查询主播
     *
     * @param $request
     * @return mixed
     * @author: LuHao
     */
    public function search(Request $request)
    {
        $v = Validator::make($request->all(), [
            'query' => 'required'
        ]);
        if ($v->fails()) {
            abort(999, $v->errors());
        }
        $query = $request->input('query');
        $star = Star::search($query)->get();
        if ( ! $star->isEmpty()) {
            return $this->result($star);
        }
        abort(1000, 'No star found!');
    }

    /**
     *
     * 验重
     *
     * @param $platform
     * @param $serial
     * @return bool
     * @author: LuHao
     */
    private function valid_duplicate($platform, $serial)
    {
        $star = Star::isExist($platform, $serial)->first();
        if ($star)
            return json_encode($star);
        else
            return false;
    }

    /**
     *
     * 熊猫
     *
     * @param $query
     * @return mixed
     * @author: LuHao
     */
    private function panda($query)
    {
        $url = 'http://api.m.panda.tv/ajax_get_liveroom_baseinfo?roomid='
            . $query . '&slaveflag=1&type=json&__version=1.0.0.1172&__plat=android';
        $result = json_decode(file_get_contents($url));
        if ($result->errno === 0) {
            $star = $this->valid_duplicate('PANDA', $result->data->info->roominfo->id);
            if ($star)
                return $star;
            $star = new Star;
            $star->nickname = $result->data->info->hostinfo->name;
            $star->platform = 'PANDA';
            $star->serial = $result->data->info->roominfo->id;
            $star->title = $result->data->info->roominfo->name;
            $star->avatar = $result->data->info->hostinfo->avatar;
            $star->cover = $result->data->info->roominfo->pictures->img;
            $star->is_live = $result->data->info->videoinfo->status == 2;
            $star->serial = $result->data->info->roominfo->id;
            $star->link = 'http://www.panda.tv/' . $star->serial;
            $star->save();
        } else {
            abort(123213, 'Platform response error!');
        }
        return $star;
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
//        return $star;
//    }

//    private function longzhu($id)
//    {
//        $url = 'http://www.quanmin.tv/json/rooms/' . $id . '/info.json';
//    }

    /**
     *
     * 全民
     *
     * @param $query
     * @return mixed
     * @author: LuHao
     */
    private function quanmin($query)
    {
        $url = 'http://www.quanmin.tv/json/rooms/' . $query . '/info.json';
        $result = json_decode(file_get_contents($url));
        if ( ! empty($result)) {
            $star = $this->valid_duplicate('QUANMIN', $result->uid);
            if ($star)
                return $star;
            $star = new Star;
            $star->nickname = $result->nick;
            $star->platform = 'QUANMIN';
            $star->serial = $result->uid;
            $star->title = $result->title;
            $star->avatar = $result->avatar;
            if (isset($result->thumb))
                $star->cover = $result->thumb;
            $star->is_live = $result->play_status;
            $star->link = 'http://www.quanmin.tv/star/' . $star->serial;
            $star->save();
        } else {
            abort(123213, 'Platform response error!');
        }
        return $star;
    }

    /**
     *
     * 斗鱼
     *
     * @param $query
     * @return mixed
     * @author: LuHao
     */
    private function douyu($query)
    {
        $url = 'room/' . $query . '?aid=android&client_sys=android&time=' . time();
        $auth = md5($url . '1231');
        $url =  'http://www.douyu.com/api/v1/' . $url . '&auth=' . $auth;
        $result = json_decode(file_get_contents($url));
        if ($result->error === 0) {
            $star = $this->valid_duplicate('DOUYU', $result->data->room_id);
            if ($star)
                return $star;
            $star = new Star;
            $star->nickname = $result->data->nickname;
            $star->platform = 'DOUYU';
            $star->title = $result->data->room_name;
            $star->avatar = $result->data->owner_avatar;
            $star->cover = $result->data->room_src;
            $star->is_live = $result->data->show_status == 1;
            $star->serial = $result->data->room_id;
            $star->link = 'http://www.douyu.com/' . $star->serial;
            $star->save();
        } else {
            abort(123213, 'Platform response error!');
        }
        return $star;
    }

    /**
     *
     * 战旗
     *
     * @param $query
     * @return mixed
     * @author: LuHao
     */
    private function zhanqi($query)
    {
        $url = 'http://www.zhanqi.tv/api/static/live.domain/' . $query . '.json';
        $result = json_decode(file_get_contents($url));
        if ($result->data != false) {
            $star = $this->valid_duplicate('ZHANQI', $result->data->code);
            if ($star)
                return $star;
            $star = new Star;
            $star->nickname = $result->data->nickname;
            $star->platform = 'ZHANQI';
            $star->title = $result->data->title;
            $star->avatar = $result->data->avatar;
            $star->cover = $result->data->spic;
            $star->is_live = $result->data->status == 4;
            $star->serial = $result->data->code;
            $star->link = 'http://www.zhanqi.tv/' . $star->serial;
            $star->info = json_encode(array('id' => $result->data->id));
            $star->save();
        } else {
            abort(123213, 'Platform response error!');
        }
        return $star;
    }
}
