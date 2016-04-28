<?php
/**
 * Created by PhpStorm.
 * User: LuHao
 * Date: 16/4/29
 * Time: 上午2:54
 */
namespace App\Http\Middleware;

class CorsMiddleware {
    public function handle($request, \Closure $next)
    {
        $response = $next($request);
        $response->header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
        $response->header('Access-Control-Allow-Headers', $request->header('Access-Control-Request-Headers'));
        $response->header('Access-Control-Allow-Origin', '*');
        return $response;
    }
}