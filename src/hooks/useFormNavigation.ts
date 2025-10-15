import { useEffect, useCallback } from 'react';

interface UseFormNavigationProps {
  onNext?: () => void;
  onPrevious?: () => void;
  enabled?: boolean;
}

/**
 * Hook to add keyboard shortcuts for form navigation
 * - Ctrl+Enter: Trigger the next/continue action
 * - Ctrl+Backspace: Trigger the previous/back action
 */
export function useFormNavigation({
  onNext,
  onPrevious,
  enabled = true
}: UseFormNavigationProps) {
  // Memoize the event handler to avoid recreating it unnecessarily
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Enter for next/continue
    if (e.ctrlKey && e.key === 'Enter' && onNext) {
      e.preventDefault();
      onNext();
    }
    // Ctrl+Backspace for previous/back
    else if (e.ctrlKey && e.key === 'Backspace' && onPrevious) {
      e.preventDefault();
      onPrevious();
    }
  }, [onNext, onPrevious]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}
