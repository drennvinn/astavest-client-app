// useValidation.ts
import { ref, computed, watch, type Ref } from 'vue';

interface ValidationRule {
    validator: (value: any) => boolean;
    message: string;
}

interface AsyncValidationRule {
    validator: (value: any) => Promise<boolean>;
    message: string;
}

/**
 * Utilitaire pour accéder à une valeur imbriquée dans un objet en utilisant une notation par points
 * @param obj - L'objet dans lequel chercher la valeur
 * @param path - Le chemin d'accès (ex: "user.address.street")
 * @returns La valeur trouvée ou undefined si le chemin n'existe pas
 */
const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((prev, curr) => prev ? prev[curr] : undefined, obj);
};

/**
 * Hook de validation de formulaire supportant la validation synchrone et asynchrone
 * @param formDataRef - Référence reactive vers les données du formulaire
 * @param rules - Objet contenant les règles de validation synchrones
 * @param asyncRules - Objet contenant les règles de validation asynchrones (optionnel)
 * @returns Un objet contenant les méthodes et propriétés de validation
 */
export function useValidation<T extends Record<string, any>>(
    formDataRef: Ref<T>,
    rules: Record<string, ValidationRule[]>,
    asyncRules: Record<string, AsyncValidationRule[]> = {}
) {
    const errors = ref<Record<string, string>>({}); // Stocke les messages d'erreur par champ
    const touchedFields = ref(new Set<string>()); // Garde une trace des champs qui ont été touchés

    const isValid = computed(() => Object.keys(errors.value).length === 0);


    /**
     * Valide un champ spécifique et met à jour les erreurs si nécessaire
     * Cette fonction n'est appelée que pour les champs qui ont été touchés
     * @param field - Le nom du champ à valider
     */
    const validateField = (field: string) => {
        const fieldRules = rules[field];
        if (!fieldRules) return;

        const value = getNestedValue(formDataRef.value, field);

        if (!touchedFields.value.has(field)) return;

        let fieldError: string | undefined;

        for (const rule of fieldRules) {
            if (!rule.validator(value)) {
                fieldError = rule.message;
                break;
            }
        }

        if (fieldError) {
            errors.value[field] = fieldError;
        } else {
            delete errors.value[field];
        }
    };


    /**
     * Valide tous les champs du formulaire de manière synchrone
     * @returns boolean - true si tous les champs sont valides, false sinon
     */
    const validate = (): boolean => {
        let isValid = true;

        Object.keys(rules).forEach(field => {
            const value = getNestedValue(formDataRef.value, field);
            let fieldError: string | undefined;

            for (const rule of rules[field]) {
                if (!rule.validator(value)) {
                    fieldError = rule.message;
                    isValid = false;
                    break;
                }
            }

            if (fieldError) {
                errors.value[field] = fieldError;
            } else {
                delete errors.value[field];
            }
        });

        return isValid;
    };


    /**
     * Exécute les validations asynchrones pour tous les champs concernés
     * @returns Promise<boolean> - true si toutes les validations asynchrones passent
     */
    const validateAsync = async (): Promise<boolean> => {
        const asyncValidations = Object.entries(asyncRules).map(async ([field, fieldRules]) => {
            const value = getNestedValue(formDataRef.value, field);

            for (const rule of fieldRules) {
                try {
                    if (!await rule.validator(value)) {
                        return { field, error: rule.message };
                    }
                } catch (error) {
                    console.error(`Error validating field ${field}:`, error);
                    return { field, error: 'Une erreur est survenue lors de la validation' };
                }
            }
            return null;
        });

        const results = await Promise.all(asyncValidations);
        const newErrors = results
            .filter((result): result is { field: string; error: string } => result !== null)
            .reduce((acc, { field, error }) => {
                acc[field] = error;
                return acc;
            }, {} as Record<string, string>);

        errors.value = { ...errors.value, ...newErrors };
        return Object.keys(newErrors).length === 0;
    };


    /**
     * Marque un champ comme "touché" et déclenche sa validation
     * @param field - Le nom du champ à marquer comme touché
     */
    const touchField = (field: string) => {
        touchedFields.value.add(field);
        validateField(field);
    };


    /**
     * Récupère le message d'erreur pour un champ spécifique
     * Ne retourne une erreur que si le champ a été touché
     * @param field - Le nom du champ
     * @returns string - Le message d'erreur ou une chaîne vide
     */
    const getFieldError = (field: string): string => {
        return touchedFields.value.has(field) ? errors.value[field] || '' : '';
    };

    /**
     * Réinitialise l'état de la validation
     * Efface toutes les erreurs et réinitialise les champs touchés
     */
    const resetForm = () => {
        errors.value = {};
        touchedFields.value.clear();
    };

    // Configuration des watchers pour la validation automatique
    Object.keys(rules).forEach(field => {
        watch(
            () => getNestedValue(formDataRef.value, field),
            () => {
                if (touchedFields.value.has(field)) {
                    validateField(field);
                }
            },
            { deep: true }
        );
    });

    return {
        errors,         // Objet contenant les erreurs actuelles
        isValid,        // Indique si le formulaire est valide
        validate,       // Fonction de validation synchrone
        validateAsync,  // Fonction de validation asynchrone
        touchField,     // Marque un champ comme touché
        getFieldError,  // Récupère l'erreur d'un champ
        resetForm,      // Réinitialise le formulaire
    };
}