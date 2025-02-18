import { ref, computed } from 'vue';
import type { StepKey } from '~/types/client/wizard';
import { STEP_CONFIG } from '~/config/client/wizard/steps';
import { useClientWizardStore } from '~/stores/clientWizardStore';

interface NavigationState {
    pendingNavigation: StepKey | null;
    showExitConfirmation: boolean;
}

export function useWizardNavigation() {
    const store = useClientWizardStore();

    // État local de la navigation
    const navigationState = ref<NavigationState>({
        pendingNavigation: null,
        showExitConfirmation: false
    });

    // Obtenir l'ordre des étapes
    const orderedSteps = computed(() => {
        return Object.entries(STEP_CONFIG)
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
        // Si des changements sont en attente, demander confirmation
        if (store.hasUnsavedChanges) {
            navigationState.value.pendingNavigation = step;
            navigationState.value.showExitConfirmation = true;
            return;
        }

        if (store.canNavigateToStep(step)) {
            try {
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

    // Confirmation de la navigation avec changements non sauvegardés
    const confirmNavigation = async () => {
        const pendingStep = navigationState.value.pendingNavigation;

        navigationState.value.showExitConfirmation = false;
        navigationState.value.pendingNavigation = null;

        if (pendingStep) {
            try {
                // Sauvegarder les changements avant la navigation
                await store.saveFormState();
                await store.navigateToStep(pendingStep);
            } catch (error) {
                // Gérer l'erreur de sauvegarde si nécessaire
                console.error('Erreur lors de la sauvegarde:', error);
            }
        }
    };

    // Annulation de la navigation
    const cancelNavigation = () => {
        navigationState.value.showExitConfirmation = false;
        navigationState.value.pendingNavigation = null;
    };

    // Obtenir le pourcentage de progression
    const getProgressPercentage = (step: StepKey): number => {
        const currentIndex = orderedSteps.value.indexOf(step);
        return Math.round((currentIndex / (orderedSteps.value.length - 1)) * 100);
    };

    return {
        // État
        navigationState,
        orderedSteps,

        // Computed
        canGoNext,
        canGoPrevious,
        isLastStep,

        // Méthodes
        navigateToStep,
        goToNextStep,
        goToPreviousStep,
        confirmNavigation,
        cancelNavigation,
        getProgressPercentage,

        // Helpers
        getNextStep,
        getPreviousStep
    };
}