import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface UseErrorHandlerOptions {
  /**
   * Show toast notification on error
   */
  showToast?: boolean;
  /**
   * Custom error message to display
   */
  customMessage?: string;
  /**
   * Callback when error occurs
   */
  onError?: (error: Error) => void;
  /**
   * Log error to console (default: true in development)
   */
  logError?: boolean;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    showToast = true,
    customMessage,
    onError,
    logError = process.env.NODE_ENV === 'development',
  } = options;

  const [error, setError] = useState<Error | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(
    (err: unknown) => {
      const error = err instanceof Error ? err : new Error(String(err));

      // Update state
      setError(error);
      setHasError(true);

      // Log to console
      if (logError) {
        console.error('Error caught by useErrorHandler:', error);
      }

      // Show toast notification
      if (showToast) {
        const message = customMessage || error.message || 'Ocorreu um erro inesperado';
        toast.error(message);
      }

      // Call custom error handler
      onError?.(error);

      return error;
    },
    [showToast, customMessage, onError, logError]
  );

  const resetError = useCallback(() => {
    setError(null);
    setHasError(false);
  }, []);

  /**
   * Wrap an async function with error handling
   */
  const wrapAsync = useCallback(
    <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
      return (async (...args: Parameters<T>) => {
        try {
          return await fn(...args);
        } catch (err) {
          handleError(err);
          throw err; // Re-throw to allow caller to handle if needed
        }
      }) as T;
    },
    [handleError]
  );

  /**
   * Execute an async function with error handling
   */
  const executeAsync = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      try {
        resetError();
        return await fn();
      } catch (err) {
        handleError(err);
        return null;
      }
    },
    [handleError, resetError]
  );

  return {
    error,
    hasError,
    handleError,
    resetError,
    wrapAsync,
    executeAsync,
  };
}

/**
 * Hook for handling errors with retry logic
 */
export function useErrorHandlerWithRetry(
  options: UseErrorHandlerOptions & {
    maxRetries?: number;
    retryDelay?: number;
  } = {}
) {
  const { maxRetries = 3, retryDelay = 1000, ...errorHandlerOptions } = options;
  const errorHandler = useErrorHandler(errorHandlerOptions);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          setRetryCount(attempt);
          setIsRetrying(attempt > 0);

          if (attempt > 0) {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
            toast.info(`Tentando novamente... (${attempt}/${maxRetries})`);
          }

          errorHandler.resetError();
          const result = await fn();
          setIsRetrying(false);
          setRetryCount(0);
          return result;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));

          // Only show error on last attempt
          if (attempt === maxRetries) {
            errorHandler.handleError(lastError);
          }
        }
      }

      setIsRetrying(false);
      return null;
    },
    [maxRetries, retryDelay, errorHandler]
  );

  return {
    ...errorHandler,
    retryCount,
    isRetrying,
    executeWithRetry,
  };
}
