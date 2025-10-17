import { useState, useEffect, lazy, Suspense } from 'react';
import { CheckCircle, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import { ProgressSteps } from '@/components/ui/progress-steps';
import type { PersonalInfoData } from '@/components/kyc/PersonalInfoStep';
import type { AddressData } from '@/components/kyc/AddressStep';
import type { IdentityData } from '@/components/kyc/IdentityStep';
import type { SelfieData } from '@/components/kyc/SelfieStep';
import type { ReviewData } from '@/components/kyc/ReviewStep';
import { toast } from 'sonner';
import { ModeToggle } from '@/components/mode-toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Kbd } from '@/components/ui/kbd';
import { KYCStepErrorBoundary } from '@/components/kyc/KYCStepErrorBoundary';
import { SelfieStepErrorBoundary } from '@/components/kyc/SelfieStepErrorBoundary';

// Lazy load KYC step components for better code splitting
const PersonalInfoStep = lazy(() => import('@/components/kyc/PersonalInfoStep').then(m => ({ default: m.PersonalInfoStep })));
const AddressStep = lazy(() => import('@/components/kyc/AddressStep').then(m => ({ default: m.AddressStep })));
const IdentityStep = lazy(() => import('@/components/kyc/IdentityStep').then(m => ({ default: m.IdentityStep })));
const SelfieStep = lazy(() => import('@/components/kyc/SelfieStep').then(m => ({ default: m.SelfieStep })));
const ReviewStep = lazy(() => import('@/components/kyc/ReviewStep').then(m => ({ default: m.ReviewStep })));

const STORAGE_KEY = 'kyc-form-data';

// Loading component for lazy-loaded steps
const StepLoader = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const stepVariants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 20,
  },
};

const steps = [
  { id: 'personal', title: 'Dados Pessoais', description: 'Informações básicas' },
  { id: 'address', title: 'Endereço', description: 'Localização' },
  { id: 'identity', title: 'Identidade', description: 'Documentos' },
  { id: 'selfie', title: 'Selfie', description: 'Verificação' },
  { id: 'review', title: 'Revisão', description: 'Confirmar' },
];

interface FormData {
  personalInfo?: PersonalInfoData;
  address?: AddressData;
  identity?: IdentityData;
  selfie?: SelfieData;
}

const Index = () => {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading saved form data:', error);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
  });

  const [isComplete, setIsComplete] = useState(false);

  const multiStepForm = useMultiStepForm(steps);

  // Auto-save to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving form data:', error);
      toast.error('Erro ao salvar progresso', {
        description: 'Não foi possível salvar automaticamente. Seus dados podem ser perdidos.',
      });
    }
  }, [formData]);

  const handlePersonalInfoNext = (data: PersonalInfoData) => {
    setFormData((prev) => ({ ...prev, personalInfo: data }));
    multiStepForm.nextStep();
  };

  const handleAddressNext = (data: AddressData) => {
    setFormData((prev) => ({ ...prev, address: data }));
    multiStepForm.nextStep();
  };

  const handleIdentityNext = (data: IdentityData) => {
    setFormData((prev) => ({ ...prev, identity: data }));
    multiStepForm.nextStep();
  };

  const handleSelfieNext = (data: SelfieData) => {
    setFormData((prev) => ({ ...prev, selfie: data }));
    multiStepForm.nextStep();
  };

  const handleFinalSubmit = () => {
    console.log('Submitting KYC data:', formData);
    
    toast.success('Verificação Enviada!', {
      description: 'Sua solicitação de verificação KYC foi enviada com sucesso.',
    });

    setIsComplete(true);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="mx-auto w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center shadow-glow">
            <CheckCircle className="h-10 w-10 text-success-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Verificação Completa!
            </h1>
            <p className="text-muted-foreground">
              Sua solicitação de verificação KYC foi enviada com sucesso. Você receberá um email em breve com o status da sua verificação.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-left space-y-3">
            <h3 className="font-semibold">Próximos Passos:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Análise dos documentos: 24-48 horas</li>
              <li>• Notificação por email sobre o resultado</li>
              <li>• Acesso liberado após aprovação</li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-80 bg-card border-r border-border flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">KYC</span>
              </div>
              <h1 className="text-xl font-bold">Verificação KYC</h1>
            </div>
            <ModeToggle />
          </div>
        </div>

        {/* Steps Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isActive = index === multiStepForm.currentStepIndex;
              const isVisited = multiStepForm.visitedSteps.has(index);
              const isClickable = isVisited || index <= multiStepForm.currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => isClickable && multiStepForm.goToStep(index)}
                  disabled={!isClickable}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isVisited
                      ? 'hover:bg-muted text-foreground'
                      : 'text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      isActive
                        ? 'bg-primary-foreground text-primary'
                        : isVisited
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{step.title}</div>
                    <div className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {step.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer Info */}
        <div className="p-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            🔒 Suas informações são protegidas com criptografia de ponta a ponta
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Mobile Header */}
          <div className="md:hidden mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Verificação KYC</h1>
              <ModeToggle />
            </div>
            <ProgressSteps
              steps={steps}
              currentStep={multiStepForm.currentStepIndex}
              visitedSteps={multiStepForm.visitedSteps}
              onStepClick={multiStepForm.goToStep}
            />
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-xl border border-border p-6 md:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{multiStepForm.currentStep.title}</h2>
                {multiStepForm.currentStep.description && (
                  <p className="text-muted-foreground mt-1">
                    Por favor forneça sua {multiStepForm.currentStep.title.toLowerCase()}
                  </p>
                )}
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Atalhos de teclado"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Atalhos de Teclado</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Use os atalhos abaixo para navegar mais rapidamente pelo formulário
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Continuar</span>
                        <div className="flex items-center gap-1">
                          <Kbd>Ctrl</Kbd>
                          <span className="text-muted-foreground">+</span>
                          <Kbd>Enter</Kbd>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Voltar</span>
                        <div className="flex items-center gap-1">
                          <Kbd>Ctrl</Kbd>
                          <span className="text-muted-foreground">+</span>
                          <Kbd>Backspace</Kbd>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Step Content */}
            <Suspense fallback={<StepLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={multiStepForm.currentStepIndex}
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  {multiStepForm.currentStepIndex === 0 && (
                    <KYCStepErrorBoundary
                      stepName="Dados Pessoais"
                      onNext={multiStepForm.nextStep}
                    >
                      <PersonalInfoStep
                        defaultValues={formData.personalInfo}
                        onNext={handlePersonalInfoNext}
                      />
                    </KYCStepErrorBoundary>
                  )}
                  {multiStepForm.currentStepIndex === 1 && (
                    <KYCStepErrorBoundary
                      stepName="Endereço"
                      onPrevious={multiStepForm.previousStep}
                      onNext={multiStepForm.nextStep}
                    >
                      <AddressStep
                        defaultValues={formData.address}
                        onNext={handleAddressNext}
                        onPrevious={multiStepForm.previousStep}
                      />
                    </KYCStepErrorBoundary>
                  )}
                  {multiStepForm.currentStepIndex === 2 && (
                    <KYCStepErrorBoundary
                      stepName="Identidade"
                      onPrevious={multiStepForm.previousStep}
                      onNext={multiStepForm.nextStep}
                    >
                      <IdentityStep
                        defaultValues={formData.identity}
                        onNext={handleIdentityNext}
                        onPrevious={multiStepForm.previousStep}
                      />
                    </KYCStepErrorBoundary>
                  )}
                  {multiStepForm.currentStepIndex === 3 && (
                    <SelfieStepErrorBoundary
                      onPrevious={multiStepForm.previousStep}
                    >
                      <SelfieStep
                        defaultValues={formData.selfie}
                        onNext={handleSelfieNext}
                        onPrevious={multiStepForm.previousStep}
                      />
                    </SelfieStepErrorBoundary>
                  )}
                  {multiStepForm.currentStepIndex === 4 && (
                    <KYCStepErrorBoundary
                      stepName="Revisão"
                      onPrevious={multiStepForm.previousStep}
                    >
                      <ReviewStep
                        data={formData as ReviewData}
                        onEdit={multiStepForm.goToStep}
                        onPrevious={multiStepForm.previousStep}
                        onSubmit={handleFinalSubmit}
                      />
                    </KYCStepErrorBoundary>
                  )}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
