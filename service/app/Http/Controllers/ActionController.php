<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Models\Star;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class ActionController extends Controller
{

    private $user_id;

    public function __construct(Request $request)
    {
        $access_token = $request->input('access_token');
        if ( ! isset($access_token)) {
            abort(401, 'Need access token.');
        }
        $this->user_id = Cache::get('access_token:' . $access_token);
        if ( ! $this->user_id)
            abort(422123, 'Invalid access token.');
    }

    // 取消关注
    public function action(Request $request)
    {
        $v = Validator::make($request->all(), [
            'action' => 'required|in:FOLLOW,UNFOLLOW,SHARE,WATCH,ADD,REMOVE',
            'lat' => 'required',
            'lng' => 'required'
        ]);
        if ($v->fails()) {
            abort(999, $v->errors());
        }
        $lat = $request->input('lat');
        $lng = $request->input('lng');
        $a = $request->input('action');
        $target = $request->input('target');
        $action = new Action();
        $action->user_id = $this->user_id;
        $action->lat = $lat;
        $action->lng = $lng;
        $action->action = $a;
        $action->target = $target;
        $action->save();
        return $this->result();
    }

}
