<?php

namespace App\Mail;
use Illuminate\Mail\Mailable;

class RegisterMail extends Mailable {
    public $link;

    public function __construct($link) {
        $this->link = $link;
    }

    public function build() {
        return $this->subject('Xác nhận đăng ký')
                    ->view('emails.register')
                    ->with(['link' => $this->link]);
    }
}
