<?php

namespace App\Http\Controllers;

use App\Models\Star;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Validator;

class UserController extends Controller
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

    /**
     *
     * 用户信息
     *
     * @return mixed
     * @author: LuHao
     */
    public function profile()
    {
        $result = User::find($this->user_id);
        return $this->result($result);
    }
    
    /**
     *
     * 关注主播
     *
     * @param $star_id
     * @return mixed
     * @author: LuHao
     */
    public function follow_star($star_id)
    {
        $star = Star::find($star_id);
        if ( ! $star)
            abort(2012, 'Wrong star id.');
        $f = Follow::isExist($this->user_id, $star_id)->first();
        if ($f)
            abort(23, 'Had been followed.');
        $follow = new Follow();
        $follow->star_id = $star->id;
        $follow->user_id = $this->user_id;
        $follow->is_notify = User::find($this->user_id)->is_auto_notify;
        $follow->save();
        return $this->result();
    }

    /**
     *
     * 取消关注主播
     *
     * @param $star_id
     * @return mixed
     * @author: LuHao
     */
    public function unfollow_star($star_id)
    {
        $f = Follow::isExist($this->user_id, $star_id)->first();
        if ( ! $f)
            abort('321', 'Not followed star.');
        $f->delete();
        return $this->result();
    }

    /**
     *
     * 已关注主播列表
     *
     * @return mixed
     * @author: LuHao
     */
    public function follow_list()
    {
        $data = Follow::where('user_id', $this->user_id)
            ->join('Star', 'Star.id', '=', 'Follow.star_id')
            ->get();
        return $this->result($data);
    }

}
