<?php

class NormalTest extends TestCase
{
    public function testHello()
    {
        $this->get('/');

        $this->assertEquals(
            $this->response->getContent(), -1
        );
    }
}
