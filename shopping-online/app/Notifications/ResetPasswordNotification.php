<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    protected $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = URL::to("http://localhost:3000/auth/reset-password?token={$this->token}&email={$notifiable->email}");

        return (new MailMessage)
            ->subject('Đặt lại mật khẩu')
            ->line('Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào liên kết bên dưới:')
            ->action('Đặt lại mật khẩu', $url)
            ->line('Nếu bạn không yêu cầu đặt lại, vui lòng bỏ qua email này.');
    }
}
