import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, FileText, CheckCircle } from 'lucide-react';
import { type PersonalInfoData } from './PersonalInfoStep';
import { type AddressData } from './AddressStep';
import { type IdentityData } from './IdentityStep';
import { type SelfieData } from './SelfieStep';

export interface ReviewData {
  personalInfo: PersonalInfoData;
  address: AddressData;
  identity: IdentityData;
  selfie: SelfieData;
}

interface ReviewStepProps {
  data: ReviewData;
  onEdit: (step: number) => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

export function ReviewStep({ data, onEdit, onPrevious, onSubmit }: ReviewStepProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onSubmit();
  };

  const sections = [
    {
      title: 'Informações Pessoais',
      stepIndex: 0,
      items: [
        { label: 'Nome Completo', value: data.personalInfo.fullName },
        { label: 'Email', value: data.personalInfo.email },
        { label: 'Telefone', value: data.personalInfo.phone },
        {
          label: 'Data de Nascimento',
          value: data.personalInfo.dateOfBirth ? format(data.personalInfo.dateOfBirth, 'dd/MM/yyyy') : '',
        },
        { label: 'País', value: data.personalInfo.country },
      ],
    },
    {
      title: 'Endereço',
      stepIndex: 1,
      items: [
        { label: 'Endereço', value: data.address.street },
        { label: 'Cidade', value: data.address.city },
        { label: 'Estado', value: data.address.state },
        { label: 'CEP', value: data.address.postalCode },
        {
          label: 'Comprovante',
          value: data.address.addressProof ? data.address.addressProof.name : 'Não enviado',
        },
      ],
    },
    {
      title: 'Identidade',
      stepIndex: 2,
      items: [
        {
          label: 'Tipo de Documento',
          value: data.identity.idType === 'passport' ? 'Passaporte' : data.identity.idType === 'driver_license' ? 'CNH' : 'RG',
        },
        { label: 'CPF', value: data.identity.idNumber },
        {
          label: 'Documento (Frente)',
          value: data.identity.idFront ? data.identity.idFront.name : 'Não enviado',
        },
        {
          label: 'Documento (Verso)',
          value: data.identity.idBack ? data.identity.idBack.name : 'Não enviado',
        },
      ],
    },
    {
      title: 'Selfie de Verificação',
      stepIndex: 3,
      items: [
        {
          label: 'Foto',
          value: data.selfie.selfie ? data.selfie.selfie.name : 'Não enviado',
        },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Revise suas informações</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Confira todos os dados antes de enviar. Você pode editar qualquer seção clicando no botão de editar.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{section.title}</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEdit(section.stepIndex)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
            </div>
            <dl className="space-y-2">
              {section.items.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">{item.label}:</dt>
                  <dd className="font-medium text-right">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label
              htmlFor="terms"
              className="text-sm font-normal cursor-pointer leading-relaxed"
            >
              Eu concordo com os{' '}
              <a href="#" className="text-primary hover:underline">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="#" className="text-primary hover:underline">
                Política de Privacidade
              </a>
              . Confirmo que as informações fornecidas são verdadeiras e precisas.
            </Label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onPrevious} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          size="lg"
          disabled={!acceptedTerms || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Enviando...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Enviar Verificação
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
