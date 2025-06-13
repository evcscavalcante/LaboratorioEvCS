import { useEffect } from 'react';
import { configureAxe } from '@axe-core/react';

// Configure axe-core for accessibility testing in development
export const useAccessibility = () => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      configureAxe({
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
          {
            id: 'focus-management',
            enabled: true,
          },
          {
            id: 'aria-labels',
            enabled: true,
          },
        ],
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        resultTypes: ['violations', 'incomplete'],
      });
    }
  }, []);
};

// Custom hook for keyboard navigation
export const useKeyboardNavigation = (onEscape?: () => void, onEnter?: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'Enter':
          if (onEnter && event.target instanceof HTMLElement) {
            // Only trigger on interactive elements
            const interactiveElements = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
            if (interactiveElements.includes(event.target.tagName) || 
                event.target.getAttribute('role') === 'button') {
              event.preventDefault();
              onEnter();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter]);
};

// Hook for focus management
export const useFocusManagement = (containerId: string) => {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [containerId]);
};

// Hook for announcing status updates to screen readers
export const useScreenReaderAnnouncement = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};