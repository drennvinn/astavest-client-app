<template>
    <form @submit.prevent="submitForm">

        <slot
            :errors="errors"
            :touchField="touchField"
            :getFieldError="getFieldError"
            :isValid="isValid"
        ></slot>

        <p
            v-if="!isValid && Object.keys(props.rules).length > 0"
            class="text-red-500 text-center"
        >Veuillez corriger les erreurs avant de soumettre.</p>

        <button
            v-if="!customSubmitBtn"
            type="submit"
            :disabled="isSubmitting || (Object.keys(props.rules).length > 0 && !isValid)"
            class="
                w-full mt-4 px-4 py-2 rounded-md
                uppercase font-semibold text-white bg-orange-500 hover:bg-orange-500
                disabled:bg-orange-300 disabled:opacity-80 disabled:cursor-not-allowed
            "
        >
            {{ submitBtnText ?? buttonText }}
        </button>

    </form>
</template>


<script setup lang="ts">

interface ValidationRule {
  validator: (value: any) => boolean;
  message: string;
}

interface AsyncValidationRule {
  validator: (value: any) => Promise<boolean>;
  message: string;
}

interface Props {
    initialData?: Record<string, any>;
    rules?: Record<string, ValidationRule[]>;
    asyncRules?: Record<string, AsyncValidationRule[]>;
    customSubmitBtn?: boolean;
    submitBtnText?: string | null;
}
const props = withDefaults(defineProps<Props>(), {
    initialData: () => ({}),
    rules: () => ({}),
    customSubmitBtn: false,
    submitBtnText: null
});

const { t } = useI18n();

const emit = defineEmits<{
    (e: 'submit', data: Record<string, any>): void
}>();

const formDataRef = ref(props.initialData);
const isSubmitting = ref(false);

const buttonText = computed(() => props.submitBtnText ?? t('send'));

watch(() => props.initialData, (newValue) => {
    formDataRef.value = { ...newValue };
}, { deep: true, immediate: true });

// Simplifié : plus besoin de gérer les chemins imbriqués ici
const {
    errors,
    isValid,
    validate,
    validateAsync,
    touchField,
    getFieldError
} = Object.keys(props.rules).length > 0
    ? useValidation(formDataRef, props.rules, props.asyncRules)
    : {
        errors: ref({}),
        isValid: computed(() => true),
        validate: () => true,
        validateAsync: async () => true,
        touchField: () => {},
        getFieldError: () => ''
    };

const submitForm = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    try {
        if (Object.keys(props.rules).length === 0) {
            emit('submit', formDataRef.value);
            return;
        }

        const isValidSync = validate();
        if (!isValidSync) {
            Object.keys(props.rules).forEach(touchField);
            return;
        }

        if (Object.keys(props.asyncRules || {}).length > 0) {
            const isValidAsync = await validateAsync();
            if (!isValidAsync) {
                Object.keys(props.asyncRules || {}).forEach(touchField);
                return;
            }
        }

        emit('submit', formDataRef.value);
    } finally {
        isSubmitting.value = false;
    }
};
</script>
