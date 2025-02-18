<template>
    <Form
        :initial-data="modelValue"
        :rules="VALIDATION_RULES.declarations"
        :custom-submit-btn="true"
        @submit="handleSubmit"
    >
        <template #default="{ errors, touchField, getFieldError }">
            <div class="space-y-8">
                <!-- Description de l'étape -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600">
                        Ces déclarations sont requises par la réglementation financière.
                        Veuillez les lire attentivement avant de les accepter.
                    </p>
                </div>

                <!-- Conformité LCB-FT -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Lutte contre le blanchiment et le financement du terrorisme (LCB-FT)</h3>

                    <FormCheckbox
                        name="aml_information"
                        label="Je déclare avoir pris connaissance des informations relatives à la réglementation LCB-FT et m'engage à fournir toute information ou document complémentaire qui pourrait être demandé dans ce cadre"
                        v-model="formData.aml_information"
                        :error="getFieldError('aml_information')"
                        required
                        @blur="touchField('aml_information')"
                    />
                </div>

                <!-- Exactitude des informations -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Exactitude des informations</h3>

                    <FormCheckbox
                        name="answers_accuracy"
                        label="Je certifie l'exactitude des informations fournies dans ce questionnaire et m'engage à informer immédiatement de tout changement significatif"
                        v-model="formData.answers_accuracy"
                        :error="getFieldError('answers_accuracy')"
                        required
                        @blur="touchField('answers_accuracy')"
                    />

                    <FormCheckbox
                        name="information_commitment"
                        label="Je m'engage à informer de tout changement de situation pouvant affecter ma capacité à investir ou mon profil de risque"
                        v-model="formData.information_commitment"
                        :error="getFieldError('information_commitment')"
                        required
                        @blur="touchField('information_commitment')"
                    />
                </div>

                <!-- Réception des documents -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Réception des documents réglementaires</h3>

                    <FormCheckbox
                        name="der_reception"
                        label="Je confirme avoir reçu et pris connaissance du Document d'Entrée en Relation (DER)"
                        v-model="formData.der_reception"
                        :error="getFieldError('der_reception')"
                        required
                        @blur="touchField('der_reception')"
                    />

                    <FormCheckbox
                        name="dic_reception"
                        label="Je confirme avoir reçu et pris connaissance des Documents d'Informations Clés (DIC) des produits proposés"
                        v-model="formData.dic_reception"
                        :error="getFieldError('dic_reception')"
                        required
                        @blur="touchField('dic_reception')"
                    />

                    <FormCheckbox
                        name="risk_report_reception"
                        label="Je confirme avoir reçu et compris le rapport détaillant mon profil de risque et les recommandations associées"
                        v-model="formData.risk_report_reception"
                        :error="getFieldError('risk_report_reception')"
                        required
                        @blur="touchField('risk_report_reception')"
                    />
                </div>

                <!-- Signature électronique -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Signature électronique</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            name="signature_date"
                            label="Date de signature"
                            type="date"
                            v-model="formData.signature_date"
                            :error="getFieldError('signature_date')"
                            :max="today"
                            required
                            @blur="touchField('signature_date')"
                        />

                        <FormInput
                            name="signature_place"
                            label="Lieu de signature"
                            v-model="formData.signature_place"
                            :error="getFieldError('signature_place')"
                            required
                            @blur="touchField('signature_place')"
                        />
                    </div>
                </div>

                <!-- Note importante -->
                <div class="mt-8 p-4 bg-yellow-50 rounded-lg">
                    <p class="text-yellow-800 text-sm">
                        En validant ce formulaire, vous signez électroniquement l'ensemble de vos déclarations.
                        Cette signature électronique a la même valeur qu'une signature manuscrite.
                    </p>
                </div>
            </div>
        </template>
    </Form>
</template>

<script setup lang="ts">
import { VALIDATION_RULES } from '@/config/client/wizard/validation';
import type { ClientDeclarations } from '@/types/client/wizard';

interface Props {
    modelValue: ClientDeclarations;
    validation?: {
        getFieldError: (field: string) => string | undefined;
        touchField: (field: string) => void;
    };
}

const props = withDefaults(defineProps<Props>(), {
    validation: undefined
});

const emit = defineEmits<{
    'update:modelValue': [value: ClientDeclarations];
    'valid': [value: boolean];
}>();

// État local
const formData = ref<ClientDeclarations>({ ...props.modelValue });

// Date du jour pour limiter la date de signature
const today = computed(() => new Date().toISOString().split('T')[0]);

// Validation des champs
const validateFields = (data: ClientDeclarations): boolean => {
    return !!(
        data.aml_information &&
        data.answers_accuracy &&
        data.information_commitment &&
        data.der_reception &&
        data.dic_reception &&
        data.risk_report_reception &&
        data.signature_date &&
        data.signature_place
    );
};

// Observateurs
watch(formData, (newValue) => {
    emit('update:modelValue', newValue);
    const isValid = validateFields(newValue);
    emit('valid', isValid);
}, { deep: true });

// Méthodes
const handleSubmit = (data: ClientDeclarations) => {
    const isValid = validateFields(data);
    emit('valid', isValid);
};
</script>