import { ref, computed } from 'vue';
import type {
    StepKey,
    ValidationError,
    StepData,
    ValidationRule
} from '~/types/client/wizard';
import { VALIDATION_RULES } from '~/config/client/wizard/validation';
import { useClientWizardStore } from '~/stores/clientWizardStore';

interface ValidationState {
    touchedFields: Set<string>;
    validatedSteps: Set<StepKey>;
    pendingValidations: Set<string>;
    lastValidated: string | null;
}

export function useWizardValidation() {
    const store = useClientWizardStore();

    // État de la validation
    const validationState = ref<ValidationState>({
        touchedFields: new Set(),
        validatedSteps: new Set(),
        pendingValidations: new Set(),
        lastValidated: null
    });

    // Vérifier si un champ a été touché
    const isFieldTouched = (stepKey: StepKey, field: string): boolean => {
        return validationState.value.touchedFields.has(`${stepKey}.${field}`);
    };

    // Marquer un champ comme touché
    const touchField = (stepKey: StepKey, field: string) => {
        validationState.value.touchedFields.add(`${stepKey}.${field}`);
        validateField(stepKey, field);
    };

    // Valider un champ spécifique
    const validateField = async (stepKey: StepKey, field: string): Promise<boolean> => {
        const rules = VALIDATION_RULES[stepKey]?.[field];
        if (!rules) return true;

        const stepData = store.steps[stepKey].data;
        const value = stepData[field as keyof typeof stepData];
        const errors: ValidationError[] = [];

        // Traiter chaque règle de validation
        for (const rule of rules) {
            try {
                const isValid = await Promise.resolve(rule.validator(value, stepData));
                if (!isValid) {
                    errors.push({
                        field,
                        message: rule.message,
                        code: rule.code
                    });
                }
            } catch (error) {
                console.error(`Erreur lors de la validation du champ ${field}:`, error);
                errors.push({
                    field,
                    message: 'Une erreur est survenue lors de la validation',
                    code: 'VALIDATION_ERROR'
                });
            }
        }

        // Mettre à jour les erreurs du champ
        const stepErrors = [...store.steps[stepKey].errors.filter(e => e.field !== field)];
        if (errors.length > 0) {
            stepErrors.push(...errors);
        }
        store.steps[stepKey].errors = stepErrors;

        return errors.length === 0;
    };

    // Valider une étape complète
    const validateStep = async (stepKey: StepKey): Promise<boolean> => {
        const rules = VALIDATION_RULES[stepKey];
        if (!rules) return true;

        validationState.value.pendingValidations.add(stepKey);

        try {
            const validations = await Promise.all(
                Object.keys(rules).map(field => validateField(stepKey, field))
            );

            const isValid = validations.every(Boolean);
            if (isValid) {
                validationState.value.validatedSteps.add(stepKey);
            } else {
                validationState.value.validatedSteps.delete(stepKey);
            }

            store.steps[stepKey].status = isValid ? 'valid' : 'error';
            validationState.value.lastValidated = new Date().toISOString();

            return isValid;
        } finally {
            validationState.value.pendingValidations.delete(stepKey);
        }
    };

    // Valider les dépendances d'un champ
    const validateDependencies = async (
        stepKey: StepKey,
        field: string
    ): Promise<boolean> => {
        const rules = VALIDATION_RULES[stepKey];
        if (!rules) return true;

        const dependentFields = Object.entries(rules)
            .filter(([, fieldRules]) =>
                fieldRules?.some(rule =>
                    rule.dependencies?.includes(field)
                )
            )
            .map(([fieldName]) => fieldName);

        const validations = await Promise.all(
            dependentFields.map(depField => validateField(stepKey, depField))
        );

        return validations.every(Boolean);
    };

    // Réinitialiser la validation
    const resetValidation = (stepKey?: StepKey) => {
        if (stepKey) {
            // Réinitialiser une étape spécifique
            store.steps[stepKey].errors = [];
            validationState.value.validatedSteps.delete(stepKey);
            validationState.value.touchedFields = new Set(
                Array.from(validationState.value.touchedFields)
                    .filter(field => !field.startsWith(`${stepKey}.`))
            );
        } else {
            // Réinitialiser toutes les étapes
            Object.keys(store.steps).forEach(key => {
                store.steps[key as StepKey].errors = [];
            });
            validationState.value.touchedFields.clear();
            validationState.value.validatedSteps.clear();
        }
    };

    // Computed properties
    const isStepValid = computed(() => (stepKey: StepKey) =>
        validationState.value.validatedSteps.has(stepKey)
    );

    const isPendingValidation = computed(() => (stepKey: StepKey) =>
        validationState.value.pendingValidations.has(stepKey)
    );

    const getFieldError = (stepKey: StepKey, field: string): string | undefined => {
        const error = store.steps[stepKey].errors.find(e => e.field === field);
        return isFieldTouched(stepKey, field) ? error?.message : undefined;
    };

    const hasStepErrors = (step: StepKey) => {
        return store.steps[step].errors.length > 0;
    };

    return {
        validationState,
        isFieldTouched,
        touchField,
        validateField,
        validateStep,
        validateDependencies,
        resetValidation,
        isStepValid,
        isPendingValidation,
        getFieldError,
        hasStepErrors
    };
}