<template>
    <Form
        :initial-data="modelValue"
        :rules="VALIDATION_RULES.professional_situation"
        :custom-submit-btn="true"
        @submit="handleSubmit"
    >
        <template #default="{ errors, touchField, getFieldError }">
            <div class="space-y-8">
                <!-- Description de l'étape -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600">
                        Ces informations nous permettent de mieux comprendre votre situation professionnelle
                        et d'adapter nos recommandations à votre profil.
                    </p>
                </div>

                <!-- Statut professionnel -->
                <FormSelect
                    name="status"
                    label="Statut professionnel"
                    v-model="formData.status"
                    :options="statusOptions"
                    :error="getFieldError('status')"
                    required
                    @blur="touchField('status')"
                />

                <!-- Informations conditionnelles pour les salariés et indépendants -->
                <div v-if="['employed', 'independent'].includes(formData.status || '')" class="space-y-6">
                    <FormInput
                        name="occupation"
                        label="Profession"
                        v-model="formData.occupation"
                        :error="getFieldError('occupation')"
                        required
                        @blur="touchField('occupation')"
                    />

                    <FormSelect
                        name="activity_sector"
                        label="Secteur d'activité"
                        v-model="formData.activity_sector"
                        :options="activitySectorOptions"
                        :error="getFieldError('activity_sector')"
                        required
                        @blur="touchField('activity_sector')"
                    />

                    <FormInput
                        name="company_name"
                        label="Nom de l'entreprise"
                        v-model="formData.company_name"
                        :error="getFieldError('company_name')"
                        required
                        @blur="touchField('company_name')"
                    />

                    <FormInput
                        name="situation_start_date"
                        label="Date de début de la situation actuelle"
                        type="date"
                        v-model="formData.situation_start_date"
                        :error="getFieldError('situation_start_date')"
                        :max="today"
                        required
                        @blur="touchField('situation_start_date')"
                    />

                    <FormInput
                        name="country_of_activity"
                        label="Pays d'activité principale"
                        v-model="formData.country_of_activity"
                        :error="getFieldError('country_of_activity')"
                        required
                        @blur="touchField('country_of_activity')"
                    />
                </div>

                <!-- Expérience financière -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Expérience professionnelle en finance</h3>

                    <FormRadio
                        name="finance_experience"
                        label="Avez-vous une expérience professionnelle dans le secteur financier ?"
                        v-model="formData.finance_experience"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('finance_experience')"
                        required
                        @blur="touchField('finance_experience')"
                        help="Cette information nous aide à évaluer votre niveau de connaissance du secteur financier"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>

<script setup lang="ts">
import { VALIDATION_RULES } from '~/config/client/wizard/validation';
import type { ProfessionalSituation } from '~/types/client/wizard';

interface Props {
    modelValue: ProfessionalSituation;
    validation?: {
        getFieldError: (field: string) => string | undefined;
        touchField: (field: string) => void;
    };
}

const props = withDefaults(defineProps<Props>(), {
    validation: undefined
});

const emit = defineEmits<{
    'update:modelValue': [value: ProfessionalSituation];
    'valid': [value: boolean];
}>();

// État local
const formData = ref<ProfessionalSituation>({ ...props.modelValue });

// Options
const statusOptions = [
    { value: 'employed', label: 'Salarié(e)' },
    { value: 'independent', label: 'Travailleur indépendant' },
    { value: 'retired', label: 'Retraité(e)' },
    { value: 'unemployed', label: 'Sans emploi' },
    { value: 'student', label: 'Étudiant(e)' }
];

const activitySectorOptions = [
    { value: 'finance', label: 'Finance, Banque, Assurance' },
    { value: 'technology', label: 'Technologies et Digital' },
    { value: 'healthcare', label: 'Santé et Médical' },
    { value: 'education', label: 'Éducation et Formation' },
    { value: 'retail', label: 'Commerce et Distribution' },
    { value: 'industry', label: 'Industrie' },
    { value: 'construction', label: 'Construction et Immobilier' },
    { value: 'services', label: 'Services' },
    { value: 'public', label: 'Secteur Public' },
    { value: 'other', label: 'Autre' }
];

// Date du jour pour limiter la date de début de situation
const today = computed(() => new Date().toISOString().split('T')[0]);

// Validation des champs
const validateFields = (data: ProfessionalSituation): boolean => {
    if (!data.status) return false;

    // Validation des champs supplémentaires pour les salariés et indépendants
    if (['employed', 'independent'].includes(data.status)) {
        if (!data.occupation || !data.activity_sector || !data.company_name ||
            !data.situation_start_date || !data.country_of_activity) {
            return false;
        }
    }

    // Validation de l'expérience financière
    if (data.finance_experience === undefined || data.finance_experience === null) {
        return false;
    }

    return true;
};

// Observateurs
watch(formData, (newValue) => {
    emit('update:modelValue', newValue);
    const isValid = validateFields(newValue);
    emit('valid', isValid);
}, { deep: true });

// Méthodes
const handleSubmit = (data: ProfessionalSituation) => {
    const isValid = validateFields(data);
    emit('valid', isValid);
};
</script>