// stores/clientWizardStore.ts

import { defineStore } from 'pinia';
import type {
    StepKey,
    WizardState,
    ValidationError,
    StepData,
    WizardStepState
} from '~/types/client/wizard';
import { useWizardValidation } from '~/composables/client/useWizardValidation';
import { StepStatus } from '~/types/client/wizard';
import { STEP_CONFIG } from '~/config/client/wizard/steps';
import { VALIDATION_RULES } from '~/config/client/wizard/validation';
import { AUTO_SAVE_DELAY, ERROR_MESSAGES } from '~/config/client/wizard/constants';

// Fonctions utilitaires
const createInitialStepState = <T extends StepData>(data: Partial<T> = {}): WizardStepState<T> => ({
    data: data as T,
    status: StepStatus.PENDING,
    errors: [],
    lastModified: new Date().toISOString(),
    isVisited: false
});

const createInitialState = (): WizardState => ({
    steps: {
        personal_information: createInitialStepState(),
        family_situation: createInitialStepState(),
        professional_situation: createInitialStepState(),
        financial_situation: createInitialStepState(),
        knowledge_experience: createInitialStepState(),
        investment_profile: createInitialStepState(),
        sustainable_preferences: createInitialStepState(),
        declarations: createInitialStepState(),
        documents: createInitialStepState()
    },
    currentStep: 'personal_information',
    lastSaved: null,
    globalErrors: [],
    isSubmitting: false,
    autoSave: {
        pending: false,
        lastAttempt: null,
        error: null
    }
});

// Variable pour stocker le timeout d'auto-sauvegarde
let _autoSaveTimeout: NodeJS.Timeout | null = null;



export const useClientWizardStore = defineStore('clientWizard', {

    state: createInitialState,

    persist: true,

    getters: {
        // Obtenir les données de l'étape courante
        currentStepData: (state): WizardStepState => state.steps[state.currentStep],

        // Calculer la progression du formulaire
        formProgress: (state): number => {
            const totalSteps = Object.keys(state.steps).length;
            const completedSteps = Object.values(state.steps)
                .filter(step => step.status === StepStatus.VALID)
                .length;
            return Math.round((completedSteps / totalSteps) * 100);
        },

        // Vérifier si une étape est valide
        isStepValid: (state) => (stepKey: StepKey): boolean => {
            return state.steps[stepKey].status === StepStatus.VALID;
        },

        // Vérifier si on peut naviguer vers une étape
        canNavigateToStep: (state) => (targetStep: StepKey): boolean => {
            if (!STEP_CONFIG[state.currentStep] || !STEP_CONFIG[targetStep]) {
                console.error(`Étape non trouvée dans STEP_CONFIG: current=${state.currentStep}, target=${targetStep}`);
                return false;
            }

            const currentStepConfig = STEP_CONFIG[state.currentStep];
            const targetStepConfig = STEP_CONFIG[targetStep];

            // On peut toujours revenir en arrière
            if (targetStepConfig.order <= currentStepConfig.order) return true;

            // Pour avancer, l'étape courante doit être valide
            const isCurrentStepValid = state.steps[state.currentStep].status === StepStatus.VALID;

            return isCurrentStepValid;
        },

        // Vérifier si le formulaire est complet
        isFormComplete: (state): boolean => {
            return Object.entries(STEP_CONFIG).every(([key, config]) => {
                return !config.required || state.steps[key as StepKey].status === StepStatus.VALID;
            });
        },

        // Vérifier s'il y a des changements non sauvegardés
        hasUnsavedChanges: (state): boolean => {
            if (!state.lastSaved) return true;
            const lastSavedDate = new Date(state.lastSaved).getTime();

            return Object.values(state.steps).some(step => {
                const stepModifiedDate = new Date(step.lastModified).getTime();
                return stepModifiedDate > lastSavedDate;
            });
        }
    },

    actions: {
        // Mise à jour des données d'une étape
        updateStepData<K extends StepKey>(
            step: K,
            data: Partial<StepData>
        ) {
            const stepState = this.steps[step];
            stepState.data = { ...stepState.data, ...data };
            stepState.lastModified = new Date().toISOString();

            // Déclencher la validation et l'auto-sauvegarde
            this.validateStep(step);
            this.scheduleAutoSave();
        },

        // Validation d'une étape
        async validateStep(step: StepKey): Promise<boolean> {
            // Pour éviter les dépendances circulaires, nous allons appeler une version simplifiée
            // qui fait juste la mise à jour du statut
            const stepState = this.steps[step];
            const stepRules = VALIDATION_RULES[step];

            // Si aucune règle, on considère l'étape comme valide
            if (!stepRules) {
                stepState.status = StepStatus.VALID;
                stepState.errors = [];
                return true;
            }

            // Déléguons le reste de la validation au composable de validation
            const { validateStepInternal } = useWizardValidation();
            const { isValid, errors } = await validateStepInternal(step, stepState.data);

            // Mise à jour du statut et des erreurs
            stepState.status = isValid ? StepStatus.VALID : StepStatus.ERROR;
            stepState.errors = errors;

            return isValid;
        },

        // Navigation vers une étape
        async navigateToStep(targetStep: StepKey) {
            if (!this.steps[targetStep]) {
                console.error(`Tentative de navigation vers une étape inexistante: ${targetStep}`);
                return;
            }
            if (this.canNavigateToStep(targetStep)) {
                try {
                    // Sauvegarder si nécessaire
                    if (this.hasUnsavedChanges) await this.saveFormState();

                    // Mettre à jour l'étape
                    this.steps[targetStep].isVisited = true;
                    this.currentStep = targetStep;

                    // Attendre explicitement le prochain tick
                    await nextTick();

                    // Préparer la nouvelle étape
                    await this.validateStep(targetStep);
                } catch (error) {
                    console.error('Erreur pendant la navigation:', error);
                    throw error;
                }
            } else {
                console.log('Navigation non autorisée vers:', targetStep);
            }
        },

        // Auto-sauvegarde
        async saveFormState(retryCount = 0): Promise<void> {
            if (this.autoSave.pending) return;

            try {
                this.autoSave.pending = true;
                this.autoSave.error = null;

                // Simuler/implémenter l'appel API
                await new Promise(resolve => setTimeout(resolve, 500));

                this.lastSaved = new Date().toISOString();
                // Nettoyer les erreurs de sauvegarde précédentes
                this.globalErrors = this.globalErrors.filter(
                    err => err.field !== 'global' || err.message !== ERROR_MESSAGES.SAVE_ERROR
                );
            } catch (error) {
                const maxRetries = 3;
                // Backoff exponentiel pour les retry
                const backoffDelay = 1000 * Math.pow(2, retryCount);

                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, backoffDelay));
                    return this.saveFormState(retryCount + 1);
                }

                this.autoSave.error = {
                    field: 'global',
                    message: ERROR_MESSAGES.SAVE_ERROR
                };
                this.globalErrors.push(this.autoSave.error);
            } finally {
                this.autoSave.pending = false;
                this.autoSave.lastAttempt = new Date().toISOString();
            }
        },

        // Planification de l'auto-sauvegarde
        scheduleAutoSave() {
            if (_autoSaveTimeout) {
                clearTimeout(_autoSaveTimeout);
            }

            _autoSaveTimeout = setTimeout(
                () => this.saveFormState(),
                AUTO_SAVE_DELAY
            ) as unknown as NodeJS.Timeout;
        },

        // Initialisation avec des données existantes
        initializeWithData(data: Partial<Record<StepKey, StepData>>) {
            Object.entries(data).forEach(([key, stepData]) => {
                if (key in this.steps) {
                    this.steps[key as StepKey].data = stepData;
                }
            });
        },

        // Soumission du formulaire
        async submitForm() {
            if (!this.isFormComplete) {
                throw new Error(ERROR_MESSAGES.VALIDATION_ERROR);
            }

            this.isSubmitting = true;
            try {
                // Validation finale de toutes les étapes
                const validations = await Promise.all(
                    Object.keys(this.steps).map(step =>
                        this.validateStep(step as StepKey)
                    )
                );

                if (validations.some(valid => !valid)) {
                    throw new Error(ERROR_MESSAGES.VALIDATION_ERROR);
                }

                // Simuler un appel API (à remplacer par votre logique)
                await new Promise(resolve => setTimeout(resolve, 1000));

                return true;
            } finally {
                this.isSubmitting = false;
            }
        },

        // Réinitialisation des erreurs
        clearErrors() {
            this.globalErrors = [];
            this.autoSave.error = null;
        }
    }
});