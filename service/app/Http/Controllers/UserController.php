<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Validator;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserController extends Controller
{

    private $user_id;

    public function __construct(Request $request)
    {
        $access_token = $request->input('access_token');
        if ( ! isset($access_token)) {
            abort(401, 'Invalid access token.');
        }
        $this->user_id = Cache::get($access_token);
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
        return $this->result(200, "OK", $result);
    }

    /**
     *
     * 关注主播
     *
     * @param $star_id
     * @return mixed
     * @author: LuHao
     */
    public function follow($star_id)
    {
        $star = Star::find($star_id);
        if ( ! isset($star))
            abort(2012, 'Wrong star id.')
        Follow::create([
            'star_id' => $star->id,
            'user_id' => $this->id
        ]);
        return $this->result();
    }

}
