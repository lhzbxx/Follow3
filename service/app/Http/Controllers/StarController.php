<?php

namespace App\Http\Controllers;

use App\Models\Star;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StarController extends Controller
{
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
            'id' => 'required|integer',
            'platform' => 'required|in:PANDA,QUANMIN,DOUYU'
        ]);
        if ($v->fails()) {
            abort(999, $v->errors());
        }
        $id = $request->input('id');
        $platform = $request->input('platform');
        $star = Star::isExist($platform, $id);
        if (empty($star))
            return $this->result($star);
        if ($platform === "PANDA") {
            $r = $this->panda($id);
            return $this->result($r);
        }
        if ($platform === "QUANMIN")
            return $this->result($this->quanmin($id));
        if ($platform === "DOUYU")
            return $this->result($this->douyu($id));
    }

    private function panda($id)
    {
        $url = 'http://api.m.panda.tv/ajax_get_liveroom_baseinfo?roomid='
            . $id . '&slaveflag=1&type=json&__version=1.0.0.1172&__plat=android';
        return file_get_contents($url);
    }

    private function huomao($id)
    {
        $url = 'http://api.huomaotv.cn/index.php?m=api&c=android&a=get_live&cid='
            . $id . '&gid=17&t=a&time=1460390807&token=153b1b37c0ebe21fe97e092a8fd39fe4&tt=a&uid=null';
    }

//    private function longzhu($id)
//    {
//        $url = 'http://www.quanmin.tv/json/rooms/' . $id . '/info.json';
//    }

    private function quanmin($id)
    {
        $url = 'http://www.quanmin.tv/json/rooms/' . $id . '/info.json';
    }

    private function douyu($id)
    {
        $url = 'room/' . $id . '?aid=android&client_sys=android&time=' . time();
        $auth = md5($url . '1231');
        $url =  'http://www.douyu.com/api/v1/' . $url . '&auth=' . $auth;
    }
}
