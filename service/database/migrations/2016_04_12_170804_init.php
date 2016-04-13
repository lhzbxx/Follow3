<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

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
            // 平台
            $table->string('platform');
            // 额外信息
            $table->string('info')->nullable();
            // 关注数
            $table->integer('followers')->default(0);
            // 编号
            $table->integer('serial');
        });
        Schema::create('User', function(Blueprint $table)
        {
            $table->increments('id');
            $table->timestamps();
            // 邮箱
            $table->string('email');
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
