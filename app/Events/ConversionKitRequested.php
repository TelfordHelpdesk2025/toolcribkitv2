<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class ConversionKitRequested
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $requestData;

    public function __construct($requestData)
    {
        $this->requestData = $requestData;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('conversionkit');
    }

    public function broadcastWith()
    {
        return $this->requestData;
    }
}
