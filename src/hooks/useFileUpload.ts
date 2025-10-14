import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface UploadedFile {
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

interface UseFileUploadOptions {
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { maxSize = 5, acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'], multiple = false } = options;
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo inválido', {
        description: `Apenas os seguintes tipos são aceitos: ${acceptedTypes.join(', ')}`,
      });
      return false;
    }

    // Check file size (convert MB to bytes)
    const maxSizeInBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error('Arquivo muito grande', {
        description: `O tamanho máximo permitido é ${maxSize}MB`,
      });
      return false;
    }

    return true;
  }, [acceptedTypes, maxSize]);

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    setIsUploading(true);
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      if (validateFile(file)) {
        const preview = file.type.startsWith('image/') 
          ? URL.createObjectURL(file)
          : '';

        validFiles.push({
          file,
          preview,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    }

    if (validFiles.length > 0) {
      setFiles((prev) => multiple ? [...prev, ...validFiles] : validFiles);
      toast.success('Upload realizado', {
        description: `${validFiles.length} arquivo(s) carregado(s) com sucesso`,
      });
    }

    setIsUploading(false);
  }, [validateFile, multiple]);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      // Revoke the preview URL to avoid memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
  }, [files]);

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
  };
}
