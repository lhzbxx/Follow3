<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

$app->post('auth/register', 'AuthController@register');
$app->post('auth/login', 'AuthController@login');
$app->post('auth/logout', 'AuthController@logout');
$app->get('auth/refresh/{refresh_token}', 'AuthController@refresh_access_token');
$app->get('auth/activate/{register_token}', 'AuthController@activate');
$app->patch('auth/reset', 'AuthController@reset_password');
$app->get('auth/reset/{reset_token}', 'AuthController@confirm_reset_password');

$app->get('user/profile', 'UserController@self_profile');
$app->get('user/profile/{user_id}', 'UserController@profile');
$app->patch('user/notify', 'UserController@notify');
$app->get('user/follow', 'UserController@follow_list');
$app->get('user/follow/online', 'UserController@online_list');
$app->get('user/follow/all', 'UserController@follow_list');
$app->post('user/follow/{star_id}', 'UserController@follow_star');
$app->delete('user/follow/{star_id}', 'UserController@unfollow_star');
$app->get('user/search', 'UserController@search_star');
$app->post('user/feedback', 'UserController@feedback');

$app->get('star/search', 'StarController@search');
$app->post('star/search', 'StarController@search');
$app->post('star/add', 'StarController@add');
$app->get('star/hot/{page}', 'StarController@hot');
$app->get('star/online/{page}', 'StarController@online');

$app->get('/version', function () {
    return '0.3.1';
});

$app->get('test', function () {
    return -1;
});

$app->get('/phpinfo', function () {
    return phpinfo();
});

$app->get('/job', function () {
    return array(
        'douyu-success: ' => Cache::get('update:douyu:success'),
        'zhanqi-success: ' => Cache::get('update:zhanqi:success'),
        'quanmin-success: ' => Cache::get('update:quanmin:success'),
        'panda-success: ' => Cache::get('update:panda:success'),
        'douyu-fail: ' => Cache::get('update:douyu:fail'),
        'zhanqi-fail: ' => Cache::get('update:zhanqi:fail'),
        'quanmin-fail: ' => Cache::get('update:quanmin:fail'),
        'panda-fail: ' => Cache::get('update:panda:fail')
        );
});

$app->get('/now', function () {
    return date("Y-m-d H:i:s");
});
