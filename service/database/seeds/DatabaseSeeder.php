<?php

use App\Models\Star;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'email' => '416005376@qq.com',
            'password' => Crypt::encrypt('123456'),
            'nickname' => '唐僧肉厂长',
            'is_auto_notify' => true
        ]);
        Star::create([
            'nickname' => '王师傅',
            'platform' => 'PANDA',
            'serial' => 10029
        ]);
    }
}
