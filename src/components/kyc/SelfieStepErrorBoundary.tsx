import React, { type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AlertCircle, ArrowLeft, Camera, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SelfieStepErrorBoundaryProps {
  children: ReactNode;
  onPrevious?: () => void;
  onReset?: () => void;
}

export function SelfieStepErrorBoundary({
  children,
  onPrevious,
  onReset,
}: SelfieStepErrorBoundaryProps) {
  const handleError = (error: Error, _errorInfo: React.ErrorInfo) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in SelfieStep:', error, _errorInfo);
    }

    // TODO: Send to error tracking service
    // trackError({ error, errorInfo: _errorInfo, context: { step: 'Selfie' } });
  };

  const fallback = (error: Error, _errorInfo: React.ErrorInfo, reset: () => void) => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Determine specific webcam/face detection error
    const getErrorDetails = () => {
      const message = error.message.toLowerCase();

      if (message.includes('camera') || message.includes('webcam')) {
        return {
          title: 'Erro ao Acessar Câmera',
          description: 'Não foi possível acessar sua câmera.',
          troubleshooting: [
            'Verifique se você deu permissão para acessar a câmera',
            'Certifique-se de que nenhum outro aplicativo está usando a câmera',
            'Tente fechar e reabrir o navegador',
            'Verifique as configurações de privacidade do seu navegador',
          ],
          icon: Camera,
        };
      }

      if (
        message.includes('permission') ||
        message.includes('denied') ||
        message.includes('notallowederror')
      ) {
        return {
          title: 'Permissão de Câmera Negada',
          description: 'Você precisa permitir o acesso à câmera para continuar.',
          troubleshooting: [
            'Clique no ícone de cadeado/câmera na barra de endereço',
            'Selecione "Permitir" para acesso à câmera',
            'Recarregue a página após alterar as permissões',
            'Se o problema persistir, verifique as configurações do navegador',
          ],
          icon: Settings,
        };
      }

      if (
        message.includes('notfounderror') ||
        message.includes('no camera') ||
        message.includes('not found')
      ) {
        return {
          title: 'Câmera Não Encontrada',
          description: 'Nenhuma câmera foi detectada no seu dispositivo.',
          troubleshooting: [
            'Verifique se seu dispositivo possui uma câmera',
            'Certifique-se de que a câmera está conectada corretamente',
            'Tente usar outro dispositivo com câmera',
            'Verifique se os drivers da câmera estão instalados',
          ],
          icon: Camera,
        };
      }

      if (
        message.includes('face detection') ||
        message.includes('human.js') ||
        message.includes('model')
      ) {
        return {
          title: 'Erro na Detecção Facial',
          description: 'Não foi possível inicializar o sistema de detecção facial.',
          troubleshooting: [
            'Verifique sua conexão com a internet',
            'Tente atualizar a página',
            'Limpe o cache do navegador',
            'Tente usar um navegador diferente (Chrome ou Firefox recomendados)',
          ],
          icon: AlertCircle,
        };
      }

      if (message.includes('notreadableerror') || message.includes('in use')) {
        return {
          title: 'Câmera Em Uso',
          description: 'A câmera está sendo usada por outro aplicativo.',
          troubleshooting: [
            'Feche outros aplicativos que possam estar usando a câmera',
            'Feche outras abas do navegador que possam estar usando a câmera',
            'Reinicie o navegador',
            'Reinicie seu dispositivo se necessário',
          ],
          icon: Camera,
        };
      }

      return {
        title: 'Erro na Captura de Selfie',
        description: 'Ocorreu um erro ao processar a captura da selfie.',
        troubleshooting: [
          'Tente novamente',
          'Verifique se há iluminação adequada',
          'Certifique-se de que seu rosto está visível',
          'Tente usar um dispositivo diferente',
        ],
        icon: AlertCircle,
      };
    };

    const errorDetails = getErrorDetails();
    const Icon = errorDetails.icon;

    return (
      <div className="flex items-center justify-center min-h-[500px] p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-destructive" />
              <CardTitle>{errorDetails.title}</CardTitle>
            </div>
            <CardDescription>{errorDetails.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <h4 className="text-sm font-semibold mb-2">Soluções possíveis:</h4>
              <ul className="space-y-2">
                {errorDetails.troubleshooting.map((step, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isDevelopment && (
              <details className="rounded-md bg-destructive/10 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-destructive mb-2">
                  Detalhes Técnicos (Desenvolvimento)
                </summary>
                <div className="text-xs font-mono space-y-2 mt-2">
                  <div>
                    <span className="font-bold">Erro:</span>
                    <p className="text-muted-foreground mt-1">{error.message}</p>
                  </div>
                  {error.stack && (
                    <div>
                      <span className="font-bold">Stack Trace:</span>
                      <pre className="text-xs mt-1 whitespace-pre-wrap break-all max-h-40 overflow-auto">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  reset();
                  onReset?.();
                }}
                className="w-full"
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>

              {onPrevious && (
                <Button onClick={onPrevious} variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Etapa Anterior
                </Button>
              )}
            </div>

            <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                <strong>Dica:</strong> Para melhor experiência, use um navegador moderno como Google
                Chrome, Firefox ou Safari em um dispositivo com câmera.
              </p>
            </div>
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
