<?php

namespace App\Http\Controllers;

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

    // 关注主播

    // 直接观看

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
        $star->followers = $star->followers + 1;
        $star->save();
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
        $star = Star::find($star_id);
        $star->followers = $star->followers - 1;
        $star->save();
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
            ->orderBy('began_at', 'desc')
            ->get();
        return $this->result($data);
    }

    /**
     *
     * 列出所有关注且在线的主播
     *
     * @author: LuHao
     */
    public function online_list()
    {
        $result = Follow::where('user_id', $this->user_id)
            ->join('Star', 'Star.id', '=', 'Follow.star_id')
            ->orderBy('began_at', 'desc')
            ->where('Star.is_live', '=', true)
            ->get();
        return $this->result($result);
    }

    /**
     *
     * 包含了是否关注信息的查询主播
     *
     * @param Request $request
     * @return mixed
     * @author: LuHao
     */
    public function search_star(Request $request)
    {
        $v = Validator::make($request->all(), [
            'query' => 'required'
        ]);
        if ($v->fails()) {
            abort(999, $v->errors());
        }
        $query = $request->input('query');
        $star = Star::search($query)
            ->leftJoin('Follow', function ($join) {
                $join->on('Follow.star_id', '=', 'Star.id')
                    ->where('Follow.user_id', '=', $this->user_id);
            })->get();
        if ( ! $star->isEmpty()) {
            return $this->result($star);
        }
        abort(1000, 'No star found!');
    }

}
