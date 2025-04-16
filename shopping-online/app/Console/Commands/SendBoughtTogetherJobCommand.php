<?php

namespace App\Console\Commands;

use App\Jobs\SendBoughtTogetherToAlgolia;
use Illuminate\Console\Command;

class SendBoughtTogetherJobCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-bought-together-job-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        SendBoughtTogetherToAlgolia::dispatch();

        $this->info('Đã gửi job SendBoughtTogetherToAlgolia thành công.');
    }
}
