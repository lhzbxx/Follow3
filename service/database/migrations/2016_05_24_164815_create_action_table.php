<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

class CreateActionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Action', function (Blueprint $table) {
            $table->increments('id');
            // 操作者
            $table->integer('user_id');
            // 地理信息
            $table->double('lat');
            $table->double('lng');
            // 动作
            $table->string('action');
            // 目标
            $table->string('target');
            // 时间信息
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('Action');
    }
}
