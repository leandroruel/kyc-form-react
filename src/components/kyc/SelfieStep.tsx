import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, ArrowLeft, RotateCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFaceDetection } from '@/hooks/useFaceDetection';

export interface SelfieData {
  selfie?: File;
}

interface SelfieStepProps {
  defaultValues?: Partial<SelfieData>;
  onNext: (data: SelfieData) => void;
  onPrevious: () => void;
}

export function SelfieStep({ onNext, onPrevious }: SelfieStepProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const videoRef = useRef<HTMLVideoElement>(null!);

  // Face detection hook
  const faceDetection = useFaceDetection(videoRef, {
    enabled: isCameraActive,
    minConfidence: 0.6,
  });

  // Get video element from Webcam ref
  useEffect(() => {
    if (webcamRef.current?.video) {
      videoRef.current = webcamRef.current.video;
    }
  }, [isCameraActive]);

  const startCamera = () => {
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!faceDetection.result.faceDetected) {
      toast.error('Nenhum rosto detectado', {
        description: 'Por favor, posicione seu rosto na frente da câmera.',
      });
      return;
    }

    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to blob
        fetch(imageSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            setCapturedFile(file);
            setPreviewUrl(imageSrc);
            stopCamera();
            faceDetection.reset();
            toast.success('Selfie capturada!', {
              description: `Foto capturada com sucesso. Confiança: ${Math.round(faceDetection.result.confidence * 100)}%`,
            });
          });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedFile) {
      toast.error('Selfie necessária', {
        description: 'Por favor, capture uma selfie usando a câmera.',
      });
      return;
    }
    onNext({ selfie: capturedFile });
  };

  const retakePhoto = () => {
    setCapturedFile(null);
    setPreviewUrl(null);
    startCamera();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <div className="bg-info/10 border border-info/20 rounded-lg p-4 mt-2 mb-4">
            <h4 className="font-semibold text-sm mb-2">Instruções para uma boa selfie:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Certifique-se de que seu rosto está claramente visível</li>
              <li>• Use boa iluminação (evite contraluz)</li>
              <li>• Remova óculos escuros, chapéus ou máscaras</li>
              <li>• Mantenha uma expressão neutra</li>
              <li>• Segure o documento ao lado do rosto (opcional)</li>
            </ul>
          </div>

          {!isCameraActive && !capturedFile && (
            <Button
              type="button"
              onClick={startCamera}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <CameraIcon className="mr-2 h-5 w-5" />
              Ativar Câmera
            </Button>
          )}

          {isCameraActive && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                  }}
                  className="w-full aspect-video object-cover"
                />

                {/* Face detection overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm">
                  {!faceDetection.isInitialized && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                      <span className="text-xs text-white font-medium">Inicializando...</span>
                    </>
                  )}
                  {faceDetection.isInitialized && faceDetection.result.faceDetected && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-white font-medium">
                        Rosto detectado ({Math.round(faceDetection.result.confidence * 100)}%)
                      </span>
                    </>
                  )}
                  {faceDetection.isInitialized && !faceDetection.result.faceDetected && (
                    <>
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-xs text-white font-medium">Nenhum rosto detectado</span>
                    </>
                  )}
                </div>

                {faceDetection.error && (
                  <div className="absolute bottom-4 left-4 right-4 px-3 py-2 rounded-lg bg-red-500/80 backdrop-blur-sm">
                    <span className="text-xs text-white">{faceDetection.error}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={stopCamera}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1"
                  disabled={!faceDetection.result.faceDetected || !faceDetection.isInitialized}
                >
                  <CameraIcon className="mr-2 h-4 w-4" />
                  Capturar Foto
                </Button>
              </div>
            </div>
          )}

          {capturedFile && !isCameraActive && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border p-4 bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Selfie capturada"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Selfie capturada</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {capturedFile.name}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                onClick={retakePhoto}
                variant="outline"
                className="w-full"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Tirar Nova Foto
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onPrevious} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button type="submit" className="flex-1" size="lg">
          Continuar
        </Button>
      </div>
    </form>
  );
}
