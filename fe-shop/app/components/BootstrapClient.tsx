'use client';

import { useEffect } from 'react';
import { Modal } from 'bootstrap';

export default function BootstrapClient() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize Bootstrap
            require('bootstrap');

            // Handle popup display
            const storageKey = "popupClosedTime";
            const displayAfterMillis = 3600000;

            const lastClosedTime = localStorage.getItem(storageKey);
            if (!lastClosedTime || Date.now() - parseInt(lastClosedTime, 10) >= displayAfterMillis) {
                const element = document.getElementById('salePopup');
                if (element) {
                    const modalInstance = new Modal(element);
                    modalInstance.show();
                }
            }
        }
    }, []);

    return null;
} 