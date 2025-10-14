import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { useFileUpload } from '@/hooks/useFileUpload';
import { ArrowLeft } from 'lucide-react';
import { cpfValidator, formatCPF } from '@/lib/validations';

const identitySchema = z.object({
  idType: z.enum(['passport', 'driver_license', 'rg'], {
    message: 'Selecione um tipo de documento',
  }),
  idNumber: cpfValidator,
});

export type IdentityData = z.infer<typeof identitySchema> & {
  idFront?: File;
  idBack?: File;
};

interface IdentityStepProps {
  defaultValues?: Partial<IdentityData>;
  onNext: (data: IdentityData) => void;
  onPrevious: () => void;
}

const idTypes = [
  { value: 'passport', label: 'Passaporte' },
  { value: 'driver_license', label: 'Carteira de Motorista' },
  { value: 'rg', label: 'RG' },
];

export function IdentityStep({ defaultValues, onNext, onPrevious }: IdentityStepProps) {
  const form = useForm<IdentityData>({
    resolver: zodResolver(identitySchema),
    defaultValues: defaultValues || {
      idType: undefined,
      idNumber: '',
    },
  });

  const frontUpload = useFileUpload({
    maxSize: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    multiple: false,
  });

  const backUpload = useFileUpload({
    maxSize: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    multiple: false,
  });

  const selectedIdType = form.watch('idType');
  const needsBackSide = selectedIdType === 'driver_license' || selectedIdType === 'rg';

  const onSubmit = (data: IdentityData) => {
    const submitData = {
      ...data,
      idFront: frontUpload.files[0]?.file,
      idBack: backUpload.files[0]?.file,
    };
    onNext(submitData);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="idType">Tipo de Documento *</Label>
          <Select
            value={form.watch('idType')}
            onValueChange={(value) => form.setValue('idType', value as any)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Selecione o tipo de documento" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {idTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.idType && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.idType.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="idNumber">CPF *</Label>
          <Input
            id="idNumber"
            {...form.register('idNumber', {
              onChange: (e) => {
                const value = e.target.value.replace(/\D/g, '');
                e.target.value = formatCPF(value);
              },
            })}
            placeholder="123.456.789-00"
            className="mt-1.5"
          />
          {form.formState.errors.idNumber && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.idNumber.message}</p>
          )}
        </div>

        <div>
          <Label>Foto do Documento (Frente) *</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Certifique-se de que o documento está legível e sem reflexos
          </p>
          <FileUpload
            onFilesSelected={(files) => frontUpload.addFiles(files)}
            files={frontUpload.files}
            onRemoveFile={frontUpload.removeFile}
            accept="image/jpeg,image/png,image/jpg"
            multiple={false}
          />
        </div>

        {needsBackSide && (
          <div>
            <Label>Foto do Documento (Verso) *</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Verso do documento
            </p>
            <FileUpload
              onFilesSelected={(files) => backUpload.addFiles(files)}
              files={backUpload.files}
              onRemoveFile={backUpload.removeFile}
              accept="image/jpeg,image/png,image/jpg"
              multiple={false}
            />
          </div>
        )}
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
