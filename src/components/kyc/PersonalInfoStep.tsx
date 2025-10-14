import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ageValidator, phoneValidator, formatPhone } from '@/lib/validations';

const personalInfoSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  phone: phoneValidator,
  dateOfBirth: ageValidator(18),
  country: z.string().min(1, 'Selecione um país'),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  defaultValues?: Partial<PersonalInfoData>;
  onNext: (data: PersonalInfoData) => void;
}

const countries = [
  'Brasil',
  'Estados Unidos',
  'Argentina',
  'Chile',
  'Colômbia',
  'México',
  'Paraguai',
  'Peru',
  'Uruguai',
  'Venezuela',
];

export function PersonalInfoStep({ defaultValues, onNext }: PersonalInfoStepProps) {
  const form = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: defaultValues || {
      fullName: '',
      email: '',
      phone: '',
      country: '',
    },
  });

  const onSubmit = (data: PersonalInfoData) => {
    onNext(data);
  };

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
          <Label>Data de Nascimento *</Label>
          <DatePicker
            selected={form.watch('dateOfBirth') || null}
            onChange={(date: Date | null) => {
              if (date) {
                form.setValue('dateOfBirth', date);
              } else {
                form.setValue('dateOfBirth', undefined);
              }
            }}
            dateFormat="dd/MM/yyyy"
            locale={ptBR}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            yearDropdownItemNumber={100}
            minDate={new Date('1900-01-01')}
            maxDate={new Date()}
            placeholderText="dd/mm/aaaa"
            className="w-full mt-1.5 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            wrapperClassName="w-full"
            isClearable
            clearButtonTitle="Limpar data"
            monthsShown={1}
            autoComplete="off"
          />
          {form.formState.errors.dateOfBirth && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="country">País de Residência *</Label>
          <Select
            value={form.watch('country')}
            onValueChange={(value) => form.setValue('country', value)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Selecione o país" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
