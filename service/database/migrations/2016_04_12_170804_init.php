<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class Init extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Star', function(Blueprint $table)
        {
            $table->increments('id');
            $table->timestamps();
            // 昵称
            $table->string('nickname');
            // 标题
            $table->string('title')->nullable();
            // 头像
            $table->string('avatar')->nullable();
            // 封面
            $table->string('cover')->nullable();
            // 平台
            $table->string('platform');
            // 链接
            $table->string('link');
            // 上次开播时间
            $table->dateTime('began_at');
            // 额外信息
            $table->string('info')->nullable();
            // 关注数
            $table->integer('followers')->default(0);
            // 编号
            $table->integer('serial');
            // 是否直播中
            $table->boolean('is_live')->default(false);
        });
        Schema::create('User', function(Blueprint $table)
        {
            $table->increments('id');
            $table->timestamps();
            // 邮箱
            $table->string('email')->unique();
            // 昵称
            $table->string('nickname');
            // 密码
            $table->string('password');
            // 是否自动邮件通知
            $table->boolean('is_auto_notify')->default(true);
        });
        Schema::create('Follow', function(Blueprint $table)
        {
            $table->increments('id');
            $table->timestamps();
            $table->integer('user_id');
            $table->integer('star_id');
            $table->boolean('is_notify');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('Star');
        Schema::drop('User');
        Schema::drop('Follow');
    }
}
