import React from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AlertCircle, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface KYCStepErrorBoundaryProps {
  children: ReactNode;
  stepName: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onReset?: () => void;
}

export function KYCStepErrorBoundary({
  children,
  stepName,
  onPrevious,
  onNext,
  onReset,
}: KYCStepErrorBoundaryProps) {
  const handleError = (error: Error, _errorInfo: React.ErrorInfo) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error in ${stepName}:`, error, _errorInfo);
    }

    // TODO: Send to error tracking service (e.g., Sentry, LogRocket)
    // trackError({ error, errorInfo: _errorInfo, context: { step: stepName } });
  };

  const fallback = (error: Error, _errorInfo: React.ErrorInfo, reset: () => void) => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Determine error type and provide specific guidance
    const getErrorGuidance = () => {
      const message = error.message.toLowerCase();

      if (message.includes('network') || message.includes('fetch')) {
        return {
          title: 'Erro de Conexão',
          description: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
          actions: ['retry', 'previous'],
        };
      }

      if (message.includes('permission') || message.includes('denied')) {
        return {
          title: 'Permissão Negada',
          description: 'Algumas permissões necessárias foram negadas. Verifique as configurações do navegador.',
          actions: ['retry', 'previous', 'next'],
        };
      }

      if (message.includes('file') || message.includes('upload')) {
        return {
          title: 'Erro no Upload de Arquivo',
          description: 'Não foi possível processar o arquivo. Tente um arquivo diferente ou menor.',
          actions: ['retry', 'previous'],
        };
      }

      if (message.includes('validation') || message.includes('invalid')) {
        return {
          title: 'Erro de Validação',
          description: 'Os dados fornecidos são inválidos. Por favor, revise as informações.',
          actions: ['retry', 'previous'],
        };
      }

      return {
        title: 'Erro Inesperado',
        description: 'Ocorreu um erro ao processar esta etapa. Tente novamente ou volte para a etapa anterior.',
        actions: ['retry', 'previous', 'next'],
      };
    };

    const guidance = getErrorGuidance();

    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>{guidance.title}</CardTitle>
            </div>
            <CardDescription>
              <span className="block mb-2">Etapa: {stepName}</span>
              {guidance.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isDevelopment && (
              <div className="rounded-md bg-muted p-3 text-sm font-mono overflow-auto max-h-40">
                <p className="font-bold text-destructive mb-1">Detalhes do Erro:</p>
                <p className="text-muted-foreground">{error.message}</p>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                      Ver stack trace
                    </summary>
                    <pre className="text-xs mt-2 whitespace-pre-wrap break-all">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {guidance.actions.includes('retry') && (
                <Button
                  onClick={() => {
                    reset();
                    onReset?.();
                  }}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Novamente
                </Button>
              )}

              <div className="flex gap-2">
                {guidance.actions.includes('previous') && onPrevious && (
                  <Button onClick={onPrevious} variant="outline" className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Etapa Anterior
                  </Button>
                )}

                {guidance.actions.includes('next') && onNext && (
                  <Button onClick={onNext} variant="outline" className="flex-1">
                    Próxima Etapa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Se o problema persistir, entre em contato com o suporte.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}
