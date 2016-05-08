<?php
/**
 * Created by PhpStorm.
 * User: LuHao
 * Date: 16/5/2
 * Time: 下午10:20
 */

namespace App\Console\Commands;

use JPush;
use Illuminate\Console\Command;

class TestNotify extends Command {

    protected $signature = 'test:notify';

    protected $description = 'Test JPush notification';

    /**
     *
     * 发送一条广播消息
     *
     * @author: LuHao
     */
    public function handle()
    {
        $client = new JPush('0aefd58ed167584a6d7612e7', '3fd3cffb02e92cddd17205c2');
        $result = $client
            ->push()->setPlatform('all')
            ->addAllAudience()
            ->setNotificationAlert('Test JPush notification.')
            ->send();
        echo json_encode($result) . "\n";
        $result = $client
            ->device()
            ->getAliasDevices('JPush_1');
        echo json_encode($result) . "\n";
        $result = $client
            ->push()->setPlatform('all')
            ->addAlias('JPush_1')
            ->addAndroidNotification('Test P2P notify.', 'Follow3', 1, array("key1"=>"value1", "key2"=>"value2"))
            ->addIosNotification("Test P2P notify.", 'iOS sound', '+1', true, 'iOS category', array("key1"=>"value1", "key2"=>"value2"))
            ->send();
        echo json_encode($result) . "\n";
    }

}