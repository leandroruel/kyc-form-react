import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/datepicker';
import { useFormNavigation } from '@/hooks/useFormNavigation';
import { ageValidator, phoneValidator, formatPhone } from '@/lib/validations';
import { AlertCircle } from 'lucide-react';

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  flag: string;
}

const personalInfoSchema = z.object({
  fullName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('E-mail inválido').max(255),
  phone: phoneValidator,
  dateOfBirth: ageValidator(18),
  country: z.string().min(1, 'Por favor, selecione um país'),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type PersonalInfoFormData = z.input<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  defaultValues?: Partial<PersonalInfoFormData>;
  onNext: (data: PersonalInfoData) => void;
}

export function PersonalInfoStep({ defaultValues, onNext }: PersonalInfoStepProps) {
  const {
    data: countries = [],
    isLoading: isLoadingCountries,
    isError: isCountriesError,
  } = useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,cca2,flag'
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common)
      );
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const countryOptions: ComboboxOption[] = countries.map((country) => ({
    value: country.name.common,
    label: country.name.common,
    icon: country.flag,
  }));
  const normalizedDefaults = {
    fullName: defaultValues?.fullName || '',
    email: defaultValues?.email || '',
    phone: defaultValues?.phone || '',
    country: defaultValues?.country || '',
    dateOfBirth: defaultValues?.dateOfBirth || undefined,
  };

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: normalizedDefaults,
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    // Parse the data through the schema to get the transformed output
    const validatedData = await personalInfoSchema.parseAsync(data);
    onNext(validatedData);
  };

  // Add keyboard shortcuts for form navigation
  useFormNavigation({
    onNext: form.handleSubmit(onSubmit),
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nome Completo *</Label>
          <Input
            id="fullName"
            {...form.register('fullName')}
            placeholder="João Silva"
            className="mt-1.5"
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.fullName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="joao.silva@email.com"
            className="mt-1.5"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            {...form.register('phone', {
              onChange: (e) => {
                e.target.value = formatPhone(e.target.value);
              },
            })}
            placeholder="(11) 99999-9999"
            className="mt-1.5"
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Data de Nascimento *</Label>
          <div className="mt-1.5">
            <DatePicker
              date={form.watch('dateOfBirth') as Date | undefined}
              onDateChange={(date) => form.setValue('dateOfBirth', date)}
              placeholder="Selecione sua data de nascimento"
              minDate={new Date('1900-01-01')}
              maxDate={new Date()}
              startYear={1900}
              endYear={new Date().getFullYear()}
            />
          </div>
          {form.formState.errors.dateOfBirth && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="country">País de Residência *</Label>
          <div className="mt-1.5">
            <Combobox
              options={countryOptions}
              value={form.watch('country')}
              onValueChange={(value) => form.setValue('country', value)}
              placeholder="Selecione o país"
              searchPlaceholder="Buscar país..."
              emptyText="Nenhum país encontrado"
              isLoading={isLoadingCountries}
              ariaLabel="Selecionar país de residência"
            />
          </div>
          {isCountriesError && (
            <div className="flex items-center gap-2 text-sm text-destructive mt-2 p-2 bg-destructive/10 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>
                Erro ao carregar lista de países. Você pode digitar o nome do país manualmente.
              </span>
            </div>
          )}
          {form.formState.errors.country && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.country.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Continuar
      </Button>
    </form>
  );
}
