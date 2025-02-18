<template>
    <Form
        :initial-data="modelValue"
        :rules="VALIDATION_RULES.sustainable_preferences"
        :custom-submit-btn="true"
        @submit="handleSubmit"
    >
        <template #default="{ errors, touchField, getFieldError }">
            <div class="space-y-8">
                <!-- Description de l'étape -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600">
                        Ces informations nous permettent de comprendre vos préférences en matière
                        d'investissement durable et de critères environnementaux, sociaux et de gouvernance (ESG).
                    </p>
                </div>

                <!-- Intégration ESG -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Intégration des critères ESG</h3>

                    <FormRadio
                        name="sustainability_integration"
                        label="Souhaitez-vous intégrer des critères ESG dans vos investissements ?"
                        v-model="formData.sustainability_integration"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('sustainability_integration')"
                        required
                        @blur="touchField('sustainability_integration')"
                        help="Les critères ESG permettent d'évaluer la durabilité et l'impact sociétal des investissements"
                    />

                    <div v-if="formData.sustainability_integration" class="space-y-6">
                        <FormSelect
                            name="esg_preference"
                            label="Quels critères ESG privilégiez-vous ?"
                            v-model="formData.esg_preference"
                            :options="esgPreferenceOptions"
                            :error="getFieldError('esg_preference')"
                            multiple
                            required
                            @blur="touchField('esg_preference')"
                            help="Vous pouvez sélectionner plusieurs critères"
                        />

                        <FormInput
                            name="taxonomy_percentage"
                            type="number"
                            label="Quel pourcentage minimum d'alignement avec la taxonomie européenne souhaitez-vous ?"
                            v-model="formData.taxonomy_percentage"
                            :error="getFieldError('taxonomy_percentage')"
                            required
                            min="0"
                            max="100"
                            @blur="touchField('taxonomy_percentage')"
                            help="La taxonomie européenne définit les activités économiques durables"
                        />

                        <FormRadio
                            name="extra_financial_priority"
                            label="Les critères extra-financiers sont-ils prioritaires sur les critères financiers ?"
                            v-model="formData.extra_financial_priority"
                            :options="[
                                { value: true, label: 'Oui' },
                                { value: false, label: 'Non' }
                            ]"
                            :error="getFieldError('extra_financial_priority')"
                            required
                            @blur="touchField('extra_financial_priority')"
                        />
                    </div>
                </div>

                <!-- Investissement à impact -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Investissement à impact</h3>

                    <FormRadio
                        name="impact_selection"
                        label="Souhaitez-vous sélectionner des investissements selon leur impact ?"
                        v-model="formData.impact_selection"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('impact_selection')"
                        required
                        @blur="touchField('impact_selection')"
                    />

                    <div v-if="formData.impact_selection">
                        <FormSelect
                            name="impact_details"
                            label="Quels domaines d'impact privilégiez-vous ?"
                            v-model="formData.impact_details"
                            :options="impactDetailsOptions"
                            :error="getFieldError('impact_details')"
                            multiple
                            required
                            @blur="touchField('impact_details')"
                            help="Sélectionnez les domaines où vous souhaitez avoir un impact positif"
                        />
                    </div>
                </div>
            </div>
        </template>
    </Form>
</template>

<script setup lang="ts">
import { VALIDATION_RULES } from '~/config/client/wizard/validation';
import type { SustainablePreferences } from '~/types/client/wizard';

interface Props {
    modelValue: SustainablePreferences;
    validation?: {
        getFieldError: (field: string) => string | undefined;
        touchField: (field: string) => void;
    };
}

const props = withDefaults(defineProps<Props>(), {
    validation: undefined
});

const emit = defineEmits<{
    'update:modelValue': [value: SustainablePreferences];
    'valid': [value: boolean];
}>();

// État local
const formData = ref<SustainablePreferences>({ ...props.modelValue });

// Options
const esgPreferenceOptions = [
    // Environnement
    { value: 'climate', label: 'Lutte contre le changement climatique' },
    { value: 'biodiversity', label: 'Protection de la biodiversité' },
    { value: 'circular_economy', label: 'Économie circulaire' },
    { value: 'renewable_energy', label: 'Énergies renouvelables' },

    // Social
    { value: 'human_rights', label: 'Droits humains' },
    { value: 'labor_rights', label: 'Droits des travailleurs' },
    { value: 'diversity', label: 'Diversité et inclusion' },
    { value: 'health', label: 'Santé et bien-être' },

    // Gouvernance
    { value: 'business_ethics', label: 'Éthique des affaires' },
    { value: 'transparency', label: 'Transparence' },
    { value: 'anti_corruption', label: 'Lutte contre la corruption' },
    { value: 'responsible_taxation', label: 'Fiscalité responsable' }
];

const impactDetailsOptions = [
    { value: 'climate_action', label: 'Action climatique' },
    { value: 'clean_energy', label: 'Énergie propre' },
    { value: 'water', label: 'Gestion de l\'eau' },
    { value: 'education', label: 'Éducation' },
    { value: 'healthcare', label: 'Santé' },
    { value: 'poverty', label: 'Réduction de la pauvreté' },
    { value: 'gender_equality', label: 'Égalité des genres' },
    { value: 'sustainable_cities', label: 'Villes durables' },
    { value: 'biodiversity', label: 'Protection de la biodiversité' },
    { value: 'innovation', label: 'Innovation durable' }
];

// Validation des champs
const validateFields = (data: SustainablePreferences): boolean => {
    if (data.sustainability_integration === undefined) {
        return false;
    }

    if (data.sustainability_integration) {
        if (
            !data.esg_preference ||
            !Array.isArray(data.esg_preference) ||
            data.esg_preference.length === 0 ||
            data.taxonomy_percentage === undefined ||
            data.taxonomy_percentage < 0 ||
            data.taxonomy_percentage > 100 ||
            data.extra_financial_priority === undefined
        ) {
            return false;
        }
    }

    if (data.impact_selection === undefined) {
        return false;
    }

    if (data.impact_selection && (!data.impact_details || !Array.isArray(data.impact_details) || data.impact_details.length === 0)) {
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
const handleSubmit = (data: SustainablePreferences) => {
    const isValid = validateFields(data);
    emit('valid', isValid);
};
</script>