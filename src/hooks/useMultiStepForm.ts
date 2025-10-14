import { useState, useCallback } from 'react';

export interface Step {
  id: string;
  title: string;
  description?: string;
}

export function useMultiStepForm(steps: Step[], initialStep: number = 0) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([initialStep]));

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
      setVisitedSteps((prev) => new Set([...prev, index]));
    }
  }, [steps.length]);

  const nextStep = useCallback(() => {
    if (!isLastStep) {
      goToStep(currentStepIndex + 1);
    }
  }, [currentStepIndex, isLastStep, goToStep]);

  const previousStep = useCallback(() => {
    if (!isFirstStep) {
      goToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, isFirstStep, goToStep]);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setVisitedSteps(new Set([0]));
  }, []);

  return {
    currentStep,
    currentStepIndex,
    steps,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    previousStep,
    reset,
    visitedSteps,
    progress: ((currentStepIndex + 1) / steps.length) * 100,
  };
}
