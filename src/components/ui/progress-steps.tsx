import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  title: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  visitedSteps?: Set<number>;
  className?: string;
}

export function ProgressSteps({
  steps,
  currentStep,
  onStepClick,
  visitedSteps = new Set(),
  className,
}: ProgressStepsProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={cn('w-full', className)}>
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        {steps.map((step, index) => {
          const isCompleted = visitedSteps.has(index) && index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = visitedSteps.has(index) && onStepClick;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={cn(
                'group relative flex flex-col items-center text-center transition-all',
                isClickable && 'cursor-pointer hover:scale-105',
                !isClickable && 'cursor-default'
              )}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  'relative z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCurrent && 'border-primary bg-primary text-primary-foreground shadow-glow scale-110',
                  isCompleted && 'border-success bg-success text-success-foreground',
                  !isCurrent && !isCompleted && 'border-muted bg-background text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <span className="text-sm md:text-base font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step title */}
              <div className="mt-2 md:mt-3">
                <p
                  className={cn(
                    'text-xs md:text-sm font-medium transition-colors',
                    isCurrent && 'text-primary',
                    !isCurrent && 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="hidden md:block text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>

              {/* Connecting line (hidden on mobile, shown on larger screens) */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'hidden md:block absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 transition-colors',
                    isCompleted ? 'bg-success' : 'bg-muted'
                  )}
                  style={{ transform: 'translateY(-50%)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
