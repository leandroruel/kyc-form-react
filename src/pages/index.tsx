import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiStepForm } from '@/hooks/useMultiStepForm';
import { ProgressSteps } from '@/components/ui/progress-steps';
import { PersonalInfoStep, type PersonalInfoData } from '@/components/kyc/PersonalInfoStep';
import { AddressStep, type AddressData } from '@/components/kyc/AddressStep';
import { IdentityStep, type IdentityData } from '@/components/kyc/IdentityStep';
import { SelfieStep, type SelfieData } from '@/components/kyc/SelfieStep';
import { ReviewStep, type ReviewData } from '@/components/kyc/ReviewStep';
import { toast } from 'sonner';
import { ModeToggle } from '@/components/mode-toggle';

const STORAGE_KEY = 'kyc-form-data';

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
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const [isComplete, setIsComplete] = useState(false);

  const multiStepForm = useMultiStepForm(steps);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{multiStepForm.currentStep.title}</h2>
              {multiStepForm.currentStep.description && (
                <p className="text-muted-foreground mt-1">
                  Por favor forneça seus {multiStepForm.currentStep.title.toLowerCase()}
                </p>
              )}
            </div>

            {/* Step Content */}
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
                  <PersonalInfoStep
                    defaultValues={formData.personalInfo}
                    onNext={handlePersonalInfoNext}
                  />
                )}
                {multiStepForm.currentStepIndex === 1 && (
                  <AddressStep
                    defaultValues={formData.address}
                    onNext={handleAddressNext}
                    onPrevious={multiStepForm.previousStep}
                  />
                )}
                {multiStepForm.currentStepIndex === 2 && (
                  <IdentityStep
                    defaultValues={formData.identity}
                    onNext={handleIdentityNext}
                    onPrevious={multiStepForm.previousStep}
                  />
                )}
                {multiStepForm.currentStepIndex === 3 && (
                  <SelfieStep
                    defaultValues={formData.selfie}
                    onNext={handleSelfieNext}
                    onPrevious={multiStepForm.previousStep}
                  />
                )}
                {multiStepForm.currentStepIndex === 4 && (
                  <ReviewStep
                    data={formData as ReviewData}
                    onEdit={multiStepForm.goToStep}
                    onPrevious={multiStepForm.previousStep}
                    onSubmit={handleFinalSubmit}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
