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
$app->get('auth/refresh/{refresh_token}', 'AuthController@refresh_access_token');
$app->get('auth/activate/{register_token}', 'AuthController@activate');
$app->patch('auth/reset/{reset_token}', 'AuthController@reset');

$app->get('user/profile/{user_id}', 'UserController@profile');
$app->patch('user/notify', 'UserController@notify');

$app->get('user/follow', 'UserController@follow');
$app->post('user/follow/{star_id}', 'UserController@follow_star');
$app->delete('user/follow/{star_id}', 'UserController@unfollow_star');

$app->post('star/search', 'StarController@search');

$app->get('/test', function () use ($app) {
    return $app->version();
});

$app->get('/version', function () {
    return '0.1.0';
});

$app->get('test', function () {
    return 0;
});

$app->get('/phpinfo', function () {
    return phpinfo();
});

$app->get('list/{id}', function ($id) {
//    $list = List::find($id);
    return $id;
});

$app->get('/cache/{data}', function ($data) {
    Cache::put('test', $data, 1);
    return 'OK';
});

$app->get('/cache', function () {
    return Cache::get('test');
});

$app->get('crypt', function () {
    return Crypt::encrypt('love');
});

$app->get('/mail/{mail}', function ($mail) {
    $to = $mail;
    $subject = '欢迎使用Follow3';
    $message = file_get_contents('activate_account.html');
    $message = wordwrap($message, 70, "\r\n");
    $headers = "MIME-Version: 1.0" . "\r\n"
        . 'Content-type: text/html; charset=iso-8859-1' . "\r\n"
        . 'From: Follow3@lhzbxx.top' . "\r\n"
        . 'X-Mailer: PHP/' . phpversion();;
    mail($to, $subject, $message, $headers);
});
