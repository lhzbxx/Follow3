<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserController extends Controller
{

    private $user_id;

    public function __construct(Request $request)
    {
        $access_token = $request->input('access_token');
        if ( ! isset($access_token)) {
            abort(401, '123');
        }
        $this->user_id = Cache::get($access_token);
    }

    public function profile()
    {
        return redirect('123');
        $result = User::find($this->user_id);
        return $this->result(200, "OK", $result);
    }

}
