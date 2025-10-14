import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { useFileUpload } from '@/hooks/useFileUpload';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';

const opencepBaseUrl = 'https://opencep.com/v1/';

interface CepApiResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
}

const addressSchema = z.object({
  street: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres').max(200),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres').max(100),
  state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres').max(100),
  postalCode: z.string().min(5, 'CEP inválido').max(20),
});

export type AddressData = z.infer<typeof addressSchema> & {
  addressProof?: File;
};

interface AddressStepProps {
  defaultValues?: Partial<AddressData>;
  onNext: (data: AddressData) => void;
  onPrevious: () => void;
}

export function AddressStep({ defaultValues, onNext, onPrevious }: AddressStepProps) {
  const form = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || {
      street: '',
      city: '',
      state: '',
      postalCode: '',
    },
  });

  const getAddressByPostalCode = async (postalCode: string): Promise<CepApiResponse | null> => {
    const response = await fetch(`${opencepBaseUrl}${postalCode}.json`);
    if (!response.ok) {
      toast.error('CEP não encontrado');
      return null;
    }
    const data: CepApiResponse = await response.json();
    return data;
  };

  const formatPostalCode = (postalCode: string) => {
    return postalCode.replace(/\D/g, '');
  };

  const postalCode = form.watch('postalCode');
  const cleanedPostalCode = formatPostalCode(postalCode);

  const { data: addressData, isLoading } = useQuery<CepApiResponse | null>({
    queryKey: ['address', cleanedPostalCode],
    queryFn: () => getAddressByPostalCode(cleanedPostalCode),
    enabled: cleanedPostalCode.length === 8,
    retry: false,
  });

  const prevAddressData = useRef<CepApiResponse | null>(null);

  useEffect(() => {
    if (addressData && addressData !== prevAddressData.current) {
      form.setValue('street', addressData.logradouro || '');
      form.setValue('city', addressData.localidade || '');
      form.setValue('state', addressData.uf || '');
      prevAddressData.current = addressData;
    }
  }, [addressData, form]);

  const fileUpload = useFileUpload({
    maxSize: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    multiple: false,
  });

  const onSubmit = (data: AddressData) => {
    const submitData = {
      ...data,
      addressProof: fileUpload.files[0]?.file,
    };
    onNext(submitData);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="street">Endereço Completo *</Label>
          <Input
            id="street"
            {...form.register('street')}
            placeholder="Rua Example, 123, Apto 45"
            className="mt-1.5"
          />
          {form.formState.errors.street && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              {...form.register('city')}
              placeholder="São Paulo"
              className="mt-1.5"
            />
            {form.formState.errors.city && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.city.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="state">Estado *</Label>
            <Input
              id="state"
              {...form.register('state')}
              placeholder="SP"
              className="mt-1.5"
            />
            {form.formState.errors.state && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.state.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="postalCode">CEP *</Label>
          <div className="relative">
            <Input
              id="postalCode"
              {...form.register('postalCode', {
                onChange: (e) => {
                  e.target.value = formatPostalCode(e.target.value);
                },
              })}
              placeholder="12345678"
              className="mt-1.5 pr-10"
              maxLength={8}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.75">
                <Spinner className="size-5 text-muted-foreground" />
              </div>
            )}
          </div>
          {form.formState.errors.postalCode && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.postalCode.message}</p>
          )}
        </div>

        <div>
          <Label>Comprovante de Endereço</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Envie uma conta de luz, água ou telefone recente
          </p>
          <FileUpload
            onFilesSelected={(files) => fileUpload.addFiles(files)}
            files={fileUpload.files}
            onRemoveFile={fileUpload.removeFile}
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            multiple={false}
          />
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
