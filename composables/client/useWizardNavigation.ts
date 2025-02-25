import { ref, computed } from 'vue';
import type { StepKey } from '~/types/client/wizard';
import { STEP_CONFIG } from '~/config/client/wizard/steps';
import { useClientWizardStore } from '~/stores/clientWizardStore';



export function useWizardNavigation() {

    const store = useClientWizardStore();


    // Obtenir l'ordre des étapes
    const orderedSteps = computed(() => {
        return Object.entries(STEP_CONFIG)
            .filter(([key]) => key in store.steps)
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([key]) => key as StepKey);
    });


    // Vérifier si on peut aller à l'étape suivante
    const canGoNext = computed(() => {
        const currentIndex = orderedSteps.value.indexOf(store.currentStep);
        return currentIndex < orderedSteps.value.length - 1 &&
            store.isStepValid(store.currentStep);
    });


    // Vérifier si on peut revenir à l'étape précédente
    const canGoPrevious = computed(() => {
        const currentIndex = orderedSteps.value.indexOf(store.currentStep);
        return currentIndex > 0;
    });


    // Vérifier si c'est la dernière étape
    const isLastStep = computed(() => {
        return store.currentStep === orderedSteps.value[orderedSteps.value.length - 1];
    });


    // Obtenir l'étape suivante
    const getNextStep = (): StepKey | null => {
        const currentIndex = orderedSteps.value.indexOf(store.currentStep);
        if (currentIndex < orderedSteps.value.length - 1) {
            return orderedSteps.value[currentIndex + 1];
        }
        return null;
    };


    // Obtenir l'étape précédente
    const getPreviousStep = (): StepKey | null => {
        const currentIndex = orderedSteps.value.indexOf(store.currentStep);
        if (currentIndex > 0) {
            return orderedSteps.value[currentIndex - 1];
        }
        return null;
    };


    // Navigation vers une étape spécifique
    const navigateToStep = async (step: StepKey) => {
        // Supprimez la logique de confirmation
        if (store.canNavigateToStep(step)) {
            try {
                // Si nécessaire, sauvegardez avant la navigation
                if (store.hasUnsavedChanges) await store.saveFormState();
                await store.navigateToStep(step);
            } catch (error) {
                console.error('Erreur lors de la navigation:', error);
            }
        } else {
            console.log('Navigation non autorisée vers:', step);
        }
    };


    // Navigation vers l'étape suivante
    const goToNextStep = async () => {
        const nextStep = getNextStep();
        if (nextStep && canGoNext.value) {
            await navigateToStep(nextStep);
        }
    };


    // Navigation vers l'étape précédente
    const goToPreviousStep = async () => {
        const previousStep = getPreviousStep();
        if (previousStep && canGoPrevious.value) {
            await navigateToStep(previousStep);
        }
    };


    // Obtenir le pourcentage de progression
    const getProgressPercentage = (step: StepKey): number => {
        const currentIndex = orderedSteps.value.indexOf(step);
        return Math.round((currentIndex / (orderedSteps.value.length - 1)) * 100);
    };




    return {
        // État
        orderedSteps,

        // Computed
        canGoNext,
        canGoPrevious,
        isLastStep,

        // Méthodes
        navigateToStep,
        goToNextStep,
        goToPreviousStep,
        getProgressPercentage,

        // Helpers
        getNextStep,
        getPreviousStep
    };
}