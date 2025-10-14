import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, ArrowLeft, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { FileUpload } from '@/components/ui/file-upload';
import { useFileUpload } from '@/hooks/useFileUpload';

export interface SelfieData {
  selfie?: File;
}

interface SelfieStepProps {
  defaultValues?: Partial<SelfieData>;
  onNext: (data: SelfieData) => void;
  onPrevious: () => void;
}

export function SelfieStep({ defaultValues, onNext, onPrevious }: SelfieStepProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileUpload = useFileUpload({
    maxSize: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    multiple: false,
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast.error('Erro ao acessar câmera', {
        description: 'Não foi possível acessar a câmera. Verifique as permissões.',
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileUpload.addFiles(dataTransfer.files);
            stopCamera();
            toast.success('Selfie capturada!', {
              description: 'Foto capturada com sucesso.',
            });
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileUpload.files.length === 0) {
      toast.error('Selfie necessária', {
        description: 'Por favor, capture ou faça upload de uma selfie.',
      });
      return;
    }
    onNext({ selfie: fileUpload.files[0].file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Selfie de Verificação *</Label>
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

          {!isCameraActive && fileUpload.files.length === 0 && (
            <div className="space-y-3">
              <Button
                type="button"
                onClick={startCamera}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Ativar Câmera
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou
                  </span>
                </div>
              </div>

              <FileUpload
                onFilesSelected={(files) => fileUpload.addFiles(files)}
                files={fileUpload.files}
                onRemoveFile={fileUpload.removeFile}
                accept="image/jpeg,image/png,image/jpg"
                multiple={false}
              />
            </div>
          )}

          {isCameraActive && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-video object-cover"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />
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
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capturar Foto
                </Button>
              </div>
            </div>
          )}

          {fileUpload.files.length > 0 && !isCameraActive && (
            <div className="space-y-3">
              <FileUpload
                onFilesSelected={(files) => fileUpload.addFiles(files)}
                files={fileUpload.files}
                onRemoveFile={fileUpload.removeFile}
                accept="image/jpeg,image/png,image/jpg"
                multiple={false}
              />
              <Button
                type="button"
                onClick={() => {
                  fileUpload.clearFiles();
                  startCamera();
                }}
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
