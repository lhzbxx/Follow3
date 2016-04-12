<?php

use Illuminate\Database\Seeder;

use \App\User;

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
            'mail' => '416005376@qq.com'
        ]);
    }
}
