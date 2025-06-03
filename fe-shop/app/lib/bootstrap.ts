'use client';

import { Modal } from 'bootstrap';

// Initialize Bootstrap components
export const initBootstrap = () => {
    if (typeof window !== 'undefined') {
        // Import Bootstrap's JavaScript
        require('bootstrap');
    }
};

// Initialize a modal
export const initModal = (elementId: string): Modal | null => {
    if (typeof window === 'undefined') return null;
    
    const element = document.getElementById(elementId);
    if (!element) return null;
    
    try {
        return new Modal(element);
    } catch (error) {
        console.error('Error initializing modal:', error);
        return null;
    }
}; 