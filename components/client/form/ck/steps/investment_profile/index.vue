<template>
    <Form
        :initial-data="modelValue"
        :rules="VALIDATION_RULES.investment_profile"
        :custom-submit-btn="true"
        @submit="handleSubmit"
    >
        <template #default="{ errors, touchField, getFieldError }">
            <div class="space-y-8">
                <!-- Description de l'étape -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600">
                        Ces informations nous permettent de comprendre vos objectifs d'investissement
                        et votre tolérance au risque pour vous proposer une stratégie adaptée.
                    </p>
                </div>

                <!-- Objectifs d'investissement -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Objectifs d'investissement</h3>

                    <FormSelect
                        name="main_objective"
                        label="Quel est votre objectif principal d'investissement ?"
                        v-model="formData.main_objective"
                        :options="mainObjectiveOptions"
                        :error="getFieldError('main_objective')"
                        required
                        @blur="touchField('main_objective')"
                    />

                    <FormSelect
                        name="objective_types"
                        label="Quels types d'objectifs souhaitez-vous atteindre ?"
                        v-model="formData.objective_types"
                        :options="objectiveTypesOptions"
                        :error="getFieldError('objective_types')"
                        multiple
                        required
                        @blur="touchField('objective_types')"
                        help="Vous pouvez sélectionner plusieurs objectifs"
                    />

                    <FormSelect
                        name="investment_horizon"
                        label="Quel est votre horizon d'investissement ?"
                        v-model="formData.investment_horizon"
                        :options="investmentHorizonOptions"
                        :error="getFieldError('investment_horizon')"
                        required
                        @blur="touchField('investment_horizon')"
                        help="Durée pendant laquelle vous envisagez de maintenir vos investissements"
                    />

                    <FormSelect
                        name="desired_return"
                        label="Quel rendement annuel moyen recherchez-vous ?"
                        v-model="formData.desired_return"
                        :options="desiredReturnOptions"
                        :error="getFieldError('desired_return')"
                        required
                        @blur="touchField('desired_return')"
                        help="Les rendements plus élevés impliquent généralement plus de risques"
                    />
                </div>

                <!-- Tolérance au risque -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Tolérance au risque</h3>

                    <FormSelect
                        name="risk_appetite"
                        label="Comment décririez-vous votre appétence au risque ?"
                        v-model="formData.risk_appetite"
                        :options="riskAppetiteOptions"
                        :error="getFieldError('risk_appetite')"
                        required
                        @blur="touchField('risk_appetite')"
                    />

                    <FormSelect
                        name="acceptable_loss"
                        label="Quelle perte maximale pourriez-vous accepter sur votre portefeuille ?"
                        v-model="formData.acceptable_loss"
                        :options="acceptableLossOptions"
                        :error="getFieldError('acceptable_loss')"
                        required
                        @blur="touchField('acceptable_loss')"
                        help="Perte maximale que vous pourriez supporter psychologiquement et financièrement"
                    />
                </div>

                <!-- Spécificités Crypto -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Spécificités des cryptoactifs</h3>

                    <FormRadio
                        name="crypto_risks_acceptance"
                        label="Acceptez-vous les risques spécifiques liés aux cryptoactifs ?"
                        v-model="formData.crypto_risks_acceptance"
                        :options="[
                            { value: true, label: 'Oui' },
                            { value: false, label: 'Non' }
                        ]"
                        :error="getFieldError('crypto_risks_acceptance')"
                        required
                        @blur="touchField('crypto_risks_acceptance')"
                        help="Volatilité importante, risque de perte totale, complexité technique..."
                    />

                    <FormTextarea
                        name="exclusion_criteria"
                        label="Avez-vous des critères d'exclusion spécifiques ?"
                        v-model="formData.exclusion_criteria"
                        :error="getFieldError('exclusion_criteria')"
                        rows="3"
                        @blur="touchField('exclusion_criteria')"
                        help="Projets, technologies ou types d'actifs que vous souhaitez exclure"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>



<script setup lang="ts">
import { VALIDATION_RULES } from '~/config/client/wizard/validation';
import type { InvestmentProfile } from '~/types/client/wizard';

interface Props {
    modelValue: InvestmentProfile;
    validation?: {
        getFieldError: (field: string) => string | undefined;
        touchField: (field: string) => void;
    };
}

const props = withDefaults(defineProps<Props>(), {
    validation: undefined
});

const emit = defineEmits<{
    'update:modelValue': [value: InvestmentProfile];
    'valid': [value: boolean];
}>();

// État local
const formData = ref<InvestmentProfile>({ ...props.modelValue });

// Options
const mainObjectiveOptions = [
    { value: 'preservation', label: 'Préservation du capital' },
    { value: 'income', label: 'Génération de revenus réguliers' },
    { value: 'growth', label: 'Croissance du capital' },
    { value: 'speculation', label: 'Recherche de plus-values importantes' }
];

const objectiveTypesOptions = [
    { value: 'retirement', label: 'Préparation de la retraite' },
    { value: 'real_estate', label: 'Projet immobilier' },
    { value: 'tax_optimization', label: 'Optimisation fiscale' },
    { value: 'inheritance', label: 'Transmission de patrimoine' },
    { value: 'diversification', label: 'Diversification du patrimoine' },
    { value: 'innovation', label: 'Investissement dans l\'innovation' }
];

const investmentHorizonOptions = [
    { value: 'very_short', label: 'Très court terme (< 1 an)' },
    { value: 'short', label: 'Court terme (1-3 ans)' },
    { value: 'medium', label: 'Moyen terme (3-5 ans)' },
    { value: 'long', label: 'Long terme (5-8 ans)' },
    { value: 'very_long', label: 'Très long terme (> 8 ans)' }
];

const desiredReturnOptions = [
    { value: 'very_low', label: '0-2% : Proche des livrets d\'épargne' },
    { value: 'low', label: '2-5% : Légèrement supérieur à l\'inflation' },
    { value: 'medium', label: '5-8% : Performance modérée' },
    { value: 'high', label: '8-12% : Performance élevée' },
    { value: 'very_high', label: '> 12% : Performance très élevée' }
];

const riskAppetiteOptions = [
    { value: 'very_low', label: 'Très faible - Je ne veux prendre aucun risque' },
    { value: 'low', label: 'Faible - Je préfère limiter les risques' },
    { value: 'medium', label: 'Modéré - J\'accepte une volatilité moyenne' },
    { value: 'high', label: 'Élevé - Je suis prêt à prendre des risques importants' },
    { value: 'very_high', label: 'Très élevé - Je recherche la performance avant tout' }
];

const acceptableLossOptions = [
    { value: 'minimal', label: 'Aucune perte ou perte minimale (-5% max)' },
    { value: 'low', label: 'Perte limitée (-5% à -15%)' },
    { value: 'medium', label: 'Perte modérée (-15% à -30%)' },
    { value: 'high', label: 'Perte importante (-30% à -50%)' },
    { value: 'very_high', label: 'Perte très importante (> -50%)' }
];

// Validation des champs
const validateFields = (data: InvestmentProfile): boolean => {
    if (
        !data.main_objective ||
        !data.investment_horizon ||
        !data.risk_appetite ||
        data.crypto_risks_acceptance === undefined ||
        !data.acceptable_loss ||
        !data.objective_types ||
        !Array.isArray(data.objective_types) ||
        data.objective_types.length === 0
    ) {
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
const handleSubmit = (data: InvestmentProfile) => {
    const isValid = validateFields(data);
    emit('valid', isValid);
};
</script>