import { ref, computed } from 'vue';
import {
    StepStatus,
    type StepKey,
    type ValidationError,
    // StepData,
    // ValidationRule
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


    /**
     * Vérifie si un champ spécifique a été touché par l'utilisateur.
     *
     * Un champ "touché" signifie que l'utilisateur a interagi avec ce champ
     * (généralement via un événement blur) et que la validation doit être appliquée.
     *
     * @param stepKey - Clé de l'étape contenant le champ
     * @param field - Nom du champ à vérifier
     * @returns boolean - true si le champ a été touché, false sinon
     */
    const isFieldTouched = (stepKey: StepKey, field: string): boolean => {
        return validationState.value.touchedFields.has(`${stepKey}.${field}`);
    };



    /**
     * Marque un champ comme "touché" et déclenche sa validation.
     *
     * Cette fonction est généralement appelée lors d'un événement blur sur un champ
     * pour indiquer que l'utilisateur a interagi avec ce champ et qu'il est prêt
     * pour la validation.
     *
     * @param stepKey - Clé de l'étape contenant le champ
     * @param field - Nom du champ à marquer comme touché
     */
    const touchField = (stepKey: StepKey, field: string) => {
        validationState.value.touchedFields.add(`${stepKey}.${field}`);
        validateField(stepKey, field);
    };



    /**
     * Valider un champ spécifique dans une étape du formulaire.
     *
     * Cette fonction applique les règles de validation définies dans VALIDATION_RULES
     * pour un champ particulier dans une étape donnée. Elle met à jour les erreurs
     * de l'étape en conséquence.
     *
     * @param stepKey - Clé de l'étape du formulaire à valider (ex: 'personal_information')
     * @param field - Nom du champ à valider dans l'étape
     * @returns Promise<boolean> - Retourne true si la validation est réussie (aucune erreur), false sinon
     *
     * Comportement:
     * - Si aucune règle n'est définie pour le champ, la validation est considérée comme réussie
     * - Si les données de l'étape n'existent pas, la validation est considérée comme réussie
     * - Les erreurs de validation sont stockées dans le store et associées à l'étape
     * - Les erreurs existantes pour d'autres champs de la même étape sont préservées
     */
    const validateField = async (stepKey: StepKey, field: string): Promise<boolean> => {
        const rules = VALIDATION_RULES[stepKey]?.[field];
        if (!rules) return true;

        const stepData = store.steps[stepKey].data;
        if (!stepData) return true; // L'absence de données n'est pas une erreur de validation

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
                    message: `Erreur de validation pour ${field}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
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



    /**
     * Effectue la validation des règles pour une étape spécifique sans modifier l'état UI.
     * Cette fonction interne exécute les validations pour tous les champs d'une étape
     * et renvoie les résultats sans mettre à jour le state global de l'application.
     *
     * @param stepKey - Clé de l'étape à valider
     * @param data - Données de l'étape à valider (peut être null/undefined)
     * @returns Un objet contenant le résultat de validation (isValid) et les erreurs trouvées
     *
     * Détails d'implémentation:
     * - Parcourt toutes les règles de validation définies pour les champs de l'étape
     * - Gère de manière sécurisée les cas où data est null/undefined
     * - Exécute chaque règle de validation contre les données fournies
     * - Collecte toutes les erreurs rencontrées pendant la validation
     * - S'arrête à la première erreur pour chaque champ (fail-fast)
     * - Supporte les validations asynchrones via Promise.resolve
     * - Capture et formate les erreurs internes pour des messages plus descriptifs
     *
     * Sécurité:
     * - Vérifie l'existence des données avant d'accéder aux propriétés
     * - Gère correctement les champs conditionnels qui dépendent d'autres valeurs
     * - Fournit des messages d'erreur détaillés incluant le nom du champ problématique
     *
     * Cette fonction est utilisée en interne par validateStep et aussi exposée
     * pour permettre au store de réutiliser la logique de validation sans dépendances circulaires.
     */
    const validateStepInternal = async (
        stepKey: StepKey,
        data: any
    ): Promise<{ isValid: boolean; errors: ValidationError[] }> => {
        const rules = VALIDATION_RULES[stepKey];
        if (!rules) return { isValid: true, errors: [] };

        const errors: ValidationError[] = [];

        for (const [field, fieldRules] of Object.entries(rules)) {
            if (!fieldRules) continue;

            for (const rule of fieldRules) {
                try {
                    const value = data?.[field];
                    // Assurez-vous que data est défini et passez-le au validateur
                    const isValid = await Promise.resolve(rule.validator(value, data || {}));
                    if (!isValid) {
                        errors.push({
                            field,
                            message: rule.message,
                            code: rule.code
                        });
                        // Passer à la validation du champ suivant
                        break;
                    }
                } catch (error) {
                    console.error(`Erreur lors de la validation du champ ${field}:`, error);
                    errors.push({
                        field,
                        message: `Erreur de validation pour ${field}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
                        code: 'VALIDATION_ERROR'
                    });
                    break;
                }
            }
        }

        return { isValid: errors.length === 0, errors };
    };


    /**
     * Valide tous les champs d'une étape du formulaire et met à jour l'état global.
     *
     * Cette fonction orchestre la validation complète d'une étape en déléguant
     * la logique de validation à validateStepInternal, puis met à jour l'état local
     * et global en fonction des résultats.
     *
     * @param stepKey - Clé de l'étape à valider
     * @returns Promise<boolean> - true si tous les champs de l'étape sont valides, false sinon
     *
     * Comportement:
     * - Ajoute l'étape en cours de validation à la liste des validations en attente
     * - Délègue la validation technique à validateStepInternal
     * - Met à jour le statut de l'étape dans le store (valid/error) selon le résultat
     * - Met à jour l'état local de la validation (validatedSteps, lastValidated, etc.)
     * - Gère le cycle de vie de la validation (pendingValidations)
     *
     * Cette fonction est généralement appelée lorsqu'une étape est complétée
     * ou lorsqu'un utilisateur tente de passer à l'étape suivante.
     */
    const validateStep = async (stepKey: StepKey): Promise<boolean> => {
        const rules = VALIDATION_RULES[stepKey];
        if (!rules) return true;

        validationState.value.pendingValidations.add(stepKey);

        try {
            const stepData = store.steps[stepKey].data;
            const { isValid, errors } = await validateStepInternal(stepKey, stepData);

            // Mise à jour de l'état local de validation
            if (isValid) {
                validationState.value.validatedSteps.add(stepKey);
            } else {
                validationState.value.validatedSteps.delete(stepKey);
            }

            // Mise à jour du store
            store.steps[stepKey].errors = errors;
            store.steps[stepKey].status = isValid ? StepStatus.VALID : StepStatus.ERROR;
            validationState.value.lastValidated = new Date().toISOString();

            return isValid;
        } finally {
            validationState.value.pendingValidations.delete(stepKey);
        }
    };



    /**
     * Valide les champs dépendants d'un champ spécifique.
     *
     * Lorsqu'un champ change, d'autres champs peuvent dépendre de sa valeur pour leur
     * propre validation. Cette fonction identifie ces champs dépendants et les valide.
     *
     * @param stepKey - Clé de l'étape contenant le champ
     * @param field - Nom du champ dont les dépendances doivent être validées
     * @returns Promise<boolean> - true si tous les champs dépendants sont valides, false sinon
     *
     * Exemple de cas d'utilisation:
     * - Quand le champ "is_pep" change, les champs conditionnels comme "function_exercised"
     *   doivent être revalidés car leur règle de validation dépend de "is_pep"
     */
    const validateDependencies = async (
        stepKey: StepKey,
        field: string
    ): Promise<boolean> => {
        const rules = VALIDATION_RULES[stepKey];
        if (!rules) return true;

        const dependentFields = Object.entries(rules)
            .filter(([, fieldRules]) => {
                if (!fieldRules) return false;
                return fieldRules.some(rule => {
                    if (!rule.dependencies) return false;
                    return rule.dependencies.includes(field);
                });
            })
            .map(([fieldName]) => fieldName);

        const validations = await Promise.all(
            dependentFields.map(depField => validateField(stepKey, depField))
        );

        return validations.every(Boolean);
    };



    /**
     * Réinitialise l'état de validation pour une ou toutes les étapes.
     *
     * Cette fonction efface les erreurs et les états de validation. Elle peut être appliquée
     * à une étape spécifique ou à toutes les étapes du formulaire.
     *
     * @param stepKey - Clé de l'étape à réinitialiser (optionnel, si non fourni, toutes les étapes sont réinitialisées)
     *
     * Comportement:
     * - Efface les erreurs de validation pour l'étape ou toutes les étapes
     * - Réinitialise l'état "touché" des champs concernés
     * - Supprime les étapes concernées de la liste des étapes validées
     */
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



    /**
     * Récupère le message d'erreur pour un champ spécifique.
     *
     * Cette fonction retourne le message d'erreur associé à un champ, mais uniquement
     * si le champ a été marqué comme "touché". Cela permet d'éviter d'afficher des
     * erreurs pour les champs que l'utilisateur n'a pas encore modifiés.
     *
     * @param stepKey - Clé de l'étape contenant le champ
     * @param field - Nom du champ dont on veut récupérer l'erreur
     * @returns string | undefined - Le message d'erreur ou undefined si pas d'erreur ou champ non touché
     */
    const getFieldError = (stepKey: StepKey, field: string): string | undefined => {
        const error = store.steps[stepKey].errors.find(e => e.field === field);
        return isFieldTouched(stepKey, field) ? error?.message : undefined;
    };



    /**
     * Vérifie si une étape contient des erreurs de validation.
     *
     * @param step - Clé de l'étape à vérifier
     * @returns boolean - true si l'étape contient au moins une erreur, false sinon
     */
    const hasStepErrors = (step: StepKey) => {
        return store.steps[step].errors.length > 0;
    };

    return {
        validationState,
        isFieldTouched,
        touchField,
        validateField,
        validateStep,
        validateStepInternal,
        validateDependencies,
        resetValidation,
        isStepValid,
        isPendingValidation,
        getFieldError,
        hasStepErrors
    };
}