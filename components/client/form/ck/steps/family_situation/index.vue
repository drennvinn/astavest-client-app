<template>
    <Form
        :initial-data="modelValue"
        :rules="VALIDATION_RULES.family_situation"
        :custom-submit-btn="true"
        @submit="handleSubmit"
    >
        <template #default="{ errors, touchField, getFieldError }">
            <div class="space-y-8">
                <!-- Description de l'étape -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600">
                        Ces informations nous permettent de mieux comprendre votre situation familiale
                        et d'adapter nos recommandations en conséquence.
                    </p>
                </div>

                <!-- Situation maritale -->
                <div class="space-y-6">
                    <FormRadio
                        name="marital_status"
                        label="Situation maritale"
                        v-model="formData.marital_status"
                        :options="maritalStatusOptions"
                        :error="getFieldError('marital_status')"
                        required
                        @blur="touchField('marital_status')"
                    />

                    <!-- Informations conditionnelles pour les personnes mariées -->
                    <div
                        v-if="formData.marital_status === 'married'"
                        class="space-y-6 pl-6 border-l-2 border-gray-100"
                    >
                        <FormInput
                            name="marriage_date"
                            label="Date de mariage"
                            type="date"
                            v-model="formData.marriage_date"
                            :error="getFieldError('marriage_date')"
                            :max="today"
                            required
                            @blur="touchField('marriage_date')"
                        />

                        <FormSelect
                            name="matrimonial_regime"
                            label="Régime matrimonial"
                            v-model="formData.matrimonial_regime"
                            :options="matrimonialRegimeOptions"
                            :error="getFieldError('matrimonial_regime')"
                            required
                            @blur="touchField('matrimonial_regime')"
                        />

                        <FormInput
                            name="marriage_contract"
                            label="Contrat de mariage"
                            v-model="formData.marriage_contract"
                            :error="getFieldError('marriage_contract')"
                            @blur="touchField('marriage_contract')"
                            help="Référence du contrat de mariage si applicable"
                        />
                    </div>

                    <!-- Informations conditionnelles pour les personnes pacsées -->
                    <div
                        v-if="formData.marital_status === 'pacs'"
                        class="space-y-6 pl-6 border-l-2 border-gray-100"
                    >
                        <FormInput
                            name="civil_solidarity_pact_date"
                            label="Date du PACS"
                            type="date"
                            v-model="formData.civil_solidarity_pact_date"
                            :error="getFieldError('civil_solidarity_pact_date')"
                            :max="today"
                            required
                            @blur="touchField('civil_solidarity_pact_date')"
                        />

                        <FormSelect
                            name="civil_solidarity_pact_regime"
                            label="Régime du PACS"
                            v-model="formData.civil_solidarity_pact_regime"
                            :options="pacsRegimeOptions"
                            :error="getFieldError('civil_solidarity_pact_regime')"
                            required
                            @blur="touchField('civil_solidarity_pact_regime')"
                        />
                    </div>

                    <!-- Date de divorce si applicable -->
                    <div v-if="formData.marital_status === 'divorced'">
                        <FormInput
                            name="divorce_date"
                            label="Date du divorce"
                            type="date"
                            v-model="formData.divorce_date"
                            :error="getFieldError('divorce_date')"
                            :max="today"
                            required
                            @blur="touchField('divorce_date')"
                        />
                    </div>
                </div>

                <!-- Enfants -->
                <div class="space-y-6">
                    <FormRadio
                        name="have_children"
                        label="Avez-vous des enfants ?"
                        v-model="formData.have_children"
                        :options="[
                            { value: 'yes', label: 'Oui' },
                            { value: 'no', label: 'Non' }
                        ]"
                        :error="getFieldError('have_children')"
                        required
                        @blur="touchField('have_children')"
                    />

                    <!-- Informations sur les enfants -->
                    <div
                        v-if="formData.have_children === 'yes'"
                        class="space-y-6 pl-6 border-l-2 border-gray-100"
                    >
                        <FormInput
                            name="number_of_children"
                            label="Nombre total d'enfants"
                            type="number"
                            v-model="formData.number_of_children"
                            :error="getFieldError('number_of_children')"
                            min="1"
                            required
                            @blur="touchField('number_of_children')"
                        />

                        <FormInput
                            name="dependent_children"
                            label="Nombre d'enfants à charge"
                            type="number"
                            v-model="formData.dependent_children"
                            :error="getFieldError('dependent_children')"
                            :min="0"
                            :max="formData.number_of_children"
                            required
                            @blur="touchField('dependent_children')"
                            help="Enfants fiscalement à charge"
                        />
                    </div>
                </div>
            </div>
        </template>
    </Form>
</template>

<script setup lang="ts">
import { VALIDATION_RULES } from '~/config/client/wizard/validation';
import type { FamilySituation } from '~/types/client/wizard';

interface Props {
    modelValue: FamilySituation;
    validation?: {
        getFieldError: (field: string) => string | undefined;
        touchField: (field: string) => void;
    };
}

const props = withDefaults(defineProps<Props>(), {
    validation: undefined
});

const emit = defineEmits<{
    'update:modelValue': [value: FamilySituation];
    'valid': [value: boolean];
}>();

// État local
const formData = ref<FamilySituation>({ ...props.modelValue });

// Options
const maritalStatusOptions = [
    { value: 'single', label: 'Célibataire' },
    { value: 'married', label: 'Marié(e)' },
    { value: 'divorced', label: 'Divorcé(e)' },
    { value: 'widowed', label: 'Veuf/Veuve' },
    { value: 'pacs', label: 'Pacsé(e)' }
];

const matrimonialRegimeOptions = [
    { value: 'legal', label: 'Communauté légale' },
    { value: 'universal', label: 'Communauté universelle' },
    { value: 'separation', label: 'Séparation de biens' },
    { value: 'participation', label: 'Participation aux acquêts' }
];

const pacsRegimeOptions = [
    { value: 'separation', label: 'Séparation de biens' },
    { value: 'indivision', label: 'Indivision' }
];

// Date du jour pour limiter les dates
const today = computed(() => new Date().toISOString().split('T')[0]);

// Vérification de la cohérence des données
const validateAllFields = (data: FamilySituation): boolean => {
    // Vérification des champs de base
    if (!data.marital_status || !data.have_children) return false;

    // Vérification des champs conditionnels selon le statut marital
    if (data.marital_status === 'married') {
        if (!data.marriage_date || !data.matrimonial_regime) return false;
    } else if (data.marital_status === 'pacs') {
        if (!data.civil_solidarity_pact_date || !data.civil_solidarity_pact_regime) return false;
    } else if (data.marital_status === 'divorced') {
        if (!data.divorce_date) return false;
    }

    // Vérification des champs liés aux enfants
    if (data.have_children === 'yes') {
        if (!data.number_of_children || !data.dependent_children) return false;
        if (data.dependent_children > data.number_of_children) return false;
    }

    return true;
};

// Observateurs
watch(formData, (newValue) => {
    emit('update:modelValue', newValue);
    const isValid = validateAllFields(newValue);
    emit('valid', isValid);
}, { deep: true });

// Méthodes
const handleSubmit = (data: FamilySituation) => {
    const isValid = validateAllFields(data);
    emit('valid', isValid);
};
</script>