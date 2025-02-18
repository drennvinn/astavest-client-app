<template>
    <Form
        :initial-data="modelValue"
        :rules="VALIDATION_RULES.financial_situation"
        :custom-submit-btn="true"
        @submit="handleSubmit"
    >
        <template #default="{ errors, touchField, getFieldError }">
            <div class="space-y-8">
                <!-- Description de l'étape -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600">
                        Ces informations nous permettent d'évaluer votre situation financière globale
                        et d'adapter nos recommandations à votre profil.
                    </p>
                </div>

                <!-- Revenus -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Revenus</h3>

                    <FormInput
                        name="annual_income"
                        label="Revenus annuels nets (€)"
                        type="number"
                        v-model="formData.annual_income"
                        :error="getFieldError('annual_income')"
                        required
                        min="0"
                        @blur="touchField('annual_income')"
                        help="Revenus totaux après impôts"
                    />

                    <FormSelect
                        name="income_sources"
                        label="Sources de revenus"
                        v-model="formData.income_sources"
                        :options="incomeSourceOptions"
                        :error="getFieldError('income_sources')"
                        required
                        multiple
                        @blur="touchField('income_sources')"
                    />
                </div>

                <!-- Patrimoine -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Patrimoine</h3>

                    <FormInput
                        name="total_assets"
                        label="Patrimoine total estimé (€)"
                        type="number"
                        v-model="formData.total_assets"
                        :error="getFieldError('total_assets')"
                        required
                        min="0"
                        @blur="touchField('total_assets')"
                        help="Incluant immobilier, épargne, investissements..."
                    />

                    <FormRadio
                        name="debts_credits"
                        label="Avez-vous des crédits ou des dettes en cours ?"
                        v-model="formData.debts_credits"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('debts_credits')"
                        required
                        @blur="touchField('debts_credits')"
                    />

                    <FormTextarea
                        v-if="formData.debts_credits"
                        name="debts_description"
                        label="Description des crédits/dettes"
                        v-model="formData.debts_description"
                        :error="getFieldError('debts_description')"
                        required
                        rows="3"
                        @blur="touchField('debts_description')"
                        help="Type de crédit, montant, durée restante..."
                    />
                </div>

                <!-- Situation fiscale -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Situation fiscale</h3>

                    <FormRadio
                        name="different_tax_residence"
                        label="Avez-vous une résidence fiscale différente de votre pays de résidence ?"
                        v-model="formData.different_tax_residence"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('different_tax_residence')"
                        required
                        @blur="touchField('different_tax_residence')"
                    />

                    <div v-if="formData.different_tax_residence" class="space-y-6">
                        <FormSelect
                            name="tax_residence_country"
                            label="Pays de résidence fiscale"
                            v-model="formData.tax_residence_country"
                            :options="countryOptions"
                            :error="getFieldError('tax_residence_country')"
                            required
                            @blur="touchField('tax_residence_country')"
                        />

                        <FormInput
                            name="tax_id_number"
                            label="Numéro d'identification fiscale"
                            v-model="formData.tax_id_number"
                            :error="getFieldError('tax_id_number')"
                            required
                            @blur="touchField('tax_id_number')"
                        />
                    </div>

                    <FormInput
                        name="mifii_identifier"
                        label="Identifiant MiFID"
                        v-model="formData.mifii_identifier"
                        :error="getFieldError('mifii_identifier')"
                        required
                        @blur="touchField('mifii_identifier')"
                        help="Numéro d'identification unique pour les services financiers"
                    />

                    <FormRadio
                        name="wealth_tax_liable"
                        label="Êtes-vous assujetti à l'IFI (Impôt sur la Fortune Immobilière) ?"
                        v-model="formData.wealth_tax_liable"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('wealth_tax_liable')"
                        required
                        @blur="touchField('wealth_tax_liable')"
                    />
                </div>

                <!-- Liens avec les États-Unis -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Liens avec les États-Unis</h3>

                    <FormRadio
                        name="us_links"
                        label="Avez-vous des liens fiscaux avec les États-Unis ?"
                        v-model="formData.us_links"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('us_links')"
                        required
                        @blur="touchField('us_links')"
                        help="Green card, nationalité américaine, résidence fiscale..."
                    />

                    <FormInput
                        v-if="formData.us_links"
                        name="us_tin"
                        label="Numéro TIN (Tax Identification Number)"
                        v-model="formData.us_tin"
                        :error="getFieldError('us_tin')"
                        required
                        @blur="touchField('us_tin')"
                        help="Numéro d'identification fiscale américain"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>

<script setup lang="ts">
import { VALIDATION_RULES } from '~/config/client/wizard/validation';
import type { FinancialSituation } from '~/types/client/wizard';

interface Props {
    modelValue: FinancialSituation;
    validation?: {
        getFieldError: (field: string) => string | undefined;
        touchField: (field: string) => void;
    };
}

const props = withDefaults(defineProps<Props>(), {
    validation: undefined
});

const emit = defineEmits<{
    'update:modelValue': [value: FinancialSituation];
    'valid': [value: boolean];
}>();

// État local
const formData = ref<FinancialSituation>({ ...props.modelValue });

// Options
const incomeSourceOptions = [
    { value: 'salary', label: 'Salaire' },
    { value: 'self_employed', label: 'Revenus d\'activité indépendante' },
    { value: 'rental', label: 'Revenus locatifs' },
    { value: 'investment', label: 'Revenus d\'investissement' },
    { value: 'pension', label: 'Pension de retraite' },
    { value: 'other', label: 'Autres revenus' }
];

const countryOptions = [
    { value: 'FR', label: 'France' },
    { value: 'BE', label: 'Belgique' },
    { value: 'CH', label: 'Suisse' },
    { value: 'LU', label: 'Luxembourg' },
    { value: 'MC', label: 'Monaco' }
];

// Validation des champs
const validateFields = (data: FinancialSituation): boolean => {
    // Vérification des champs obligatoires de base
    if (
        data.annual_income === undefined ||
        data.total_assets === undefined ||
        !data.income_sources ||
        data.income_sources.length === 0 ||
        data.debts_credits === undefined ||
        data.different_tax_residence === undefined ||
        data.wealth_tax_liable === undefined ||
        data.us_links === undefined ||
        !data.mifii_identifier
    ) {
        return false;
    }

    // Vérification des champs conditionnels
    if (data.debts_credits && !data.debts_description) {
        return false;
    }

    if (data.different_tax_residence && (!data.tax_residence_country || !data.tax_id_number)) {
        return false;
    }

    if (data.us_links && !data.us_tin) {
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
const handleSubmit = (data: FinancialSituation) => {
    const isValid = validateFields(data);
    emit('valid', isValid);
};
</script>