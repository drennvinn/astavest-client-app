<template>
    <Form
        :initial-data="modelValue"
        :rules="VALIDATION_RULES.knowledge_experience"
        :custom-submit-btn="true"
        @submit="handleSubmit"
    >
        <template #default="{ errors, touchField, getFieldError }">
            <div class="space-y-8">
                <!-- Description de l'étape -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600">
                        Ces informations nous permettent d'évaluer votre niveau de connaissance et
                        d'expérience en matière d'investissement pour mieux adapter nos recommandations.
                    </p>
                </div>

                <!-- Produits monétaires et obligataires -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Produits monétaires et obligataires</h3>

                    <FormRadio
                        name="monetary_products_holding"
                        label="Détenez-vous ou avez-vous déjà détenu des produits monétaires ou obligataires ?"
                        v-model="formData.monetary_products_holding"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('monetary_products_holding')"
                        required
                        @blur="touchField('monetary_products_holding')"
                        help="Livrets, comptes à terme, obligations d'État ou d'entreprises..."
                    />

                    <template v-if="formData.monetary_products_holding">
                        <FormSelect
                            name="monetary_products_duration"
                            label="Depuis combien de temps ?"
                            v-model="formData.monetary_products_duration"
                            :options="experienceDurationOptions"
                            :error="getFieldError('monetary_products_duration')"
                            required
                            @blur="touchField('monetary_products_duration')"
                        />

                        <FormSelect
                            name="monetary_products_frequency"
                            label="À quelle fréquence effectuez-vous des opérations ?"
                            v-model="formData.monetary_products_frequency"
                            :options="tradingFrequencyOptions"
                            :error="getFieldError('monetary_products_frequency')"
                            required
                            @blur="touchField('monetary_products_frequency')"
                        />
                    </template>
                </div>

                <!-- Actions et produits boursiers -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Actions et produits boursiers</h3>

                    <FormRadio
                        name="stocks_holding"
                        label="Détenez-vous ou avez-vous déjà détenu des actions ou des produits boursiers ?"
                        v-model="formData.stocks_holding"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('stocks_holding')"
                        required
                        @blur="touchField('stocks_holding')"
                        help="Actions, ETF, OPCVM, produits structurés..."
                    />

                    <template v-if="formData.stocks_holding">
                        <FormSelect
                            name="stocks_duration"
                            label="Depuis combien de temps ?"
                            v-model="formData.stocks_duration"
                            :options="experienceDurationOptions"
                            :error="getFieldError('stocks_duration')"
                            required
                            @blur="touchField('stocks_duration')"
                        />

                        <FormSelect
                            name="stocks_frequency"
                            label="À quelle fréquence effectuez-vous des opérations ?"
                            v-model="formData.stocks_frequency"
                            :options="tradingFrequencyOptions"
                            :error="getFieldError('stocks_frequency')"
                            required
                            @blur="touchField('stocks_frequency')"
                        />
                    </template>
                </div>

                <!-- Cryptoactifs -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Cryptoactifs</h3>

                    <FormRadio
                        name="crypto_holding"
                        label="Détenez-vous ou avez-vous déjà détenu des cryptoactifs ?"
                        v-model="formData.crypto_holding"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('crypto_holding')"
                        required
                        @blur="touchField('crypto_holding')"
                        help="Bitcoin, Ethereum, ou autres cryptomonnaies..."
                    />

                    <template v-if="formData.crypto_holding">
                        <FormSelect
                            name="crypto_duration"
                            label="Depuis combien de temps ?"
                            v-model="formData.crypto_duration"
                            :options="experienceDurationOptions"
                            :error="getFieldError('crypto_duration')"
                            required
                            @blur="touchField('crypto_duration')"
                        />

                        <FormSelect
                            name="crypto_frequency"
                            label="À quelle fréquence effectuez-vous des opérations ?"
                            v-model="formData.crypto_frequency"
                            :options="tradingFrequencyOptions"
                            :error="getFieldError('crypto_frequency')"
                            required
                            @blur="touchField('crypto_frequency')"
                        />

                        <FormInput
                            name="crypto_types"
                            label="Types de cryptoactifs détenus"
                            v-model="formData.crypto_types"
                            :error="getFieldError('crypto_types')"
                            required
                            @blur="touchField('crypto_types')"
                            help="Ex: Bitcoin, Ethereum, stablecoins..."
                        />
                    </template>
                </div>

                <!-- Expérience en gestion -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Expérience en gestion</h3>

                    <FormRadio
                        name="portfolio_management_experience"
                        label="Avez-vous déjà utilisé un service de gestion de portefeuille ?"
                        v-model="formData.portfolio_management_experience"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('portfolio_management_experience')"
                        required
                        @blur="touchField('portfolio_management_experience')"
                    />

                    <FormRadio
                        name="direct_management_experience"
                        label="Gérez-vous ou avez-vous déjà géré directement vos investissements ?"
                        v-model="formData.direct_management_experience"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('direct_management_experience')"
                        required
                        @blur="touchField('direct_management_experience')"
                    />
                </div>

                <!-- Connaissances spécifiques -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Connaissances spécifiques en cryptoactifs</h3>

                    <FormSelect
                        name="stablecoins_knowledge"
                        label="Quel est votre niveau de connaissance des stablecoins ?"
                        v-model="formData.stablecoins_knowledge"
                        :options="knowledgeLevelOptions"
                        :error="getFieldError('stablecoins_knowledge')"
                        required
                        @blur="touchField('stablecoins_knowledge')"
                    />

                    <FormSelect
                        name="tokens_knowledge"
                        label="Quel est votre niveau de connaissance des tokens ?"
                        v-model="formData.tokens_knowledge"
                        :options="knowledgeLevelOptions"
                        :error="getFieldError('tokens_knowledge')"
                        required
                        @blur="touchField('tokens_knowledge')"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>

<script setup lang="ts">
import { VALIDATION_RULES } from '~/config/client/wizard/validation';
import type { KnowledgeExperience } from '~/types/client/wizard';

interface Props {
    modelValue: KnowledgeExperience;
    validation?: {
        getFieldError: (field: string) => string | undefined;
        touchField: (field: string) => void;
    };
}

const props = withDefaults(defineProps<Props>(), {
    validation: undefined
});

const emit = defineEmits<{
    'update:modelValue': [value: KnowledgeExperience];
    'valid': [value: boolean];
}>();

// État local
const formData = ref<KnowledgeExperience>({ ...props.modelValue });

// Options
const experienceDurationOptions = [
    { value: 'less_than_1_year', label: 'Moins d\'1 an' },
    { value: '1_to_3_years', label: '1 à 3 ans' },
    { value: '3_to_5_years', label: '3 à 5 ans' },
    { value: 'more_than_5_years', label: 'Plus de 5 ans' }
];

const tradingFrequencyOptions = [
    { value: 'very_frequent', label: 'Très fréquent (plusieurs fois par semaine)' },
    { value: 'frequent', label: 'Fréquent (plusieurs fois par mois)' },
    { value: 'occasional', label: 'Occasionnel (quelques fois par an)' },
    { value: 'rare', label: 'Rare (moins d\'une fois par an)' }
];

const knowledgeLevelOptions = [
    { value: 'none', label: 'Aucune connaissance' },
    { value: 'basic', label: 'Connaissances de base' },
    { value: 'good', label: 'Bonnes connaissances' },
    { value: 'expert', label: 'Expert' }
];

// Validation des champs
const validateFields = (data: KnowledgeExperience): boolean => {
    // Vérification des champs obligatoires de base
    if (
        data.monetary_products_holding === undefined ||
        data.stocks_holding === undefined ||
        data.crypto_holding === undefined ||
        data.portfolio_management_experience === undefined ||
        data.direct_management_experience === undefined ||
        !data.stablecoins_knowledge ||
        !data.tokens_knowledge
    ) {
        return false;
    }

    // Validation des champs conditionnels pour les produits monétaires
    if (data.monetary_products_holding && (!data.monetary_products_duration || !data.monetary_products_frequency)) {
        return false;
    }

    // Validation des champs conditionnels pour les actions
    if (data.stocks_holding && (!data.stocks_duration || !data.stocks_frequency)) {
        return false;
    }

    // Validation des champs conditionnels pour les cryptoactifs
    if (data.crypto_holding && (!data.crypto_duration || !data.crypto_frequency || !data.crypto_types)) {
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
const handleSubmit = (data: KnowledgeExperience) => {
    const isValid = validateFields(data);
    emit('valid', isValid);
};
</script>