<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class VerifyEmailNotification extends Notification
{
    use Queueable;
    protected $user;
    /**
     * Create a new notification instance.
     */
    public function __construct($user)
    {
        //
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $url = URL::temporarySignedRoute(
            'auth.verify',
            now()->addMinutes(60),
            ['uuid' => $notifiable->id] // Truyền UUID thay vì user_id
        );

        return (new MailMessage)
            ->subject('Xác nhận email')
            ->line('Cảm ơn bạn đã đăng ký. Vui lòng nhấp vào liên kết bên dưới để xác minh tài khoản:')
            ->action('Xác nhận email', $url)
            ->line('Liên kết này sẽ hết hạn sau 60 phút.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
