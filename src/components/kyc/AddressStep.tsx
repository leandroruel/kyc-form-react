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

const opencepBaseUrl = 'https://opencep.com/v1/';

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

  const getAddressByPostalCode = async (postalCode: string) => {
    const response = await fetch(`${opencepBaseUrl}${postalCode}`);
    const data = await response.json();
    return data;
  };

  const formatPostalCode = (postalCode: string) => {
    return postalCode.replace(/\D/g, '');
  };

  const { data: addressData } = useQuery({
    queryKey: ['address', form.watch('postalCode')],
    queryFn: () => getAddressByPostalCode(form.watch('postalCode')),
    enabled: !!form.watch('postalCode'),
  });

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
            {...form.register('street', {
              onChange: (e) => {
                e.target.value = addressData?.logradouro || '';
              },
            })}
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
              {...form.register('city', {
                onChange: (e) => {
                  e.target.value = addressData?.cidade || '';
                },
              })}
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
              {...form.register('state', {
                onChange: (e) => {
                  e.target.value = addressData?.estado || '';
                },
              })}
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
          <Input
            id="postalCode"
            {...form.register('postalCode', {
              onChange: (e) => {
                e.target.value = formatPostalCode(e.target.value);
              },
            })}
            placeholder="12345-678"
            className="mt-1.5"
          />
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
