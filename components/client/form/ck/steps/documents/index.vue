<template>
    <Form
        :initial-data="modelValue"
        :rules="VALIDATION_RULES.documents"
        :custom-submit-btn="true"
        @submit="handleSubmit"
    >
        <template #default="{ errors, touchField, getFieldError }">
            <div class="space-y-8">
                <!-- Description de l'étape -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600">
                        Pour finaliser votre dossier, veuillez fournir les documents justificatifs suivants.
                        Tous les documents doivent être lisibles et en cours de validité.
                    </p>
                </div>

                <!-- Liste des documents requis -->
                <div class="space-y-8">
                    <!-- Pièce d'identité -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium">Pièce d'identité</h3>
                        <p class="text-sm text-gray-600">
                            Carte nationale d'identité (recto-verso) ou passeport en cours de validité
                        </p>
                        <FormFile
                            :multiple="false"
                            v-model="formData.identity_card"
                            :error="getFieldError('identity_card')"
                            @blur="touchField('identity_card')"
                        />
                        <div v-if="getFieldError('identity_card')" class="text-red-500 text-sm mt-1">
                            {{ getFieldError('identity_card') }}
                        </div>
                    </div>

                    <!-- Justificatif de domicile -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium">Justificatif de domicile</h3>
                        <p class="text-sm text-gray-600">
                            Document de moins de 3 mois (facture d'énergie, téléphone fixe, quittance de loyer...)
                        </p>
                        <FormFile
                            v-model="formData.proof_of_address"
                            :error="getFieldError('proof_of_address')"
                            @blur="touchField('proof_of_address')"
                        />
                        <div v-if="getFieldError('proof_of_address')" class="text-red-500 text-sm mt-1">
                            {{ getFieldError('proof_of_address') }}
                        </div>
                    </div>

                    <!-- RIB -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium">Relevé d'Identité Bancaire (RIB)</h3>
                        <p class="text-sm text-gray-600">
                            RIB du compte à débiter/créditer à votre nom
                        </p>
                        <FormFile
                            v-model="formData.bank_details"
                            :error="getFieldError('bank_details')"
                            @blur="touchField('bank_details')"
                        />
                        <div v-if="getFieldError('bank_details')" class="text-red-500 text-sm mt-1">
                            {{ getFieldError('bank_details') }}
                        </div>
                    </div>

                    <!-- Justificatif de revenus -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium">Justificatif de revenus</h3>
                        <p class="text-sm text-gray-600">
                            Dernier avis d'imposition ou dernières fiches de paie
                        </p>
                        <FormFile
                            v-model="formData.income_declaration"
                            :error="getFieldError('income_declaration')"
                            @blur="touchField('income_declaration')"
                        />
                        <div v-if="getFieldError('income_declaration')" class="text-red-500 text-sm mt-1">
                            {{ getFieldError('income_declaration') }}
                        </div>
                    </div>

                    <!-- Avis d'imposition -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-medium">Dernier avis d'imposition</h3>
                        <p class="text-sm text-gray-600">
                            Document complet incluant toutes les pages
                        </p>
                        <FormFile
                            v-model="formData.tax_notice"
                            :error="getFieldError('tax_notice')"
                            @blur="touchField('tax_notice')"
                        />
                        <div v-if="getFieldError('tax_notice')" class="text-red-500 text-sm mt-1">
                            {{ getFieldError('tax_notice') }}
                        </div>
                    </div>
                </div>

                <!-- État de la vérification -->
                <div class="mt-8">
                    <div class="p-4 rounded-lg" :class="verificationStatusClasses">
                        <div class="flex items-center">
                            <span class="mr-2">
                                <Icon :name="verificationStatusIcon" class="w-5 h-5" />
                            </span>
                            <span class="font-medium">{{ verificationStatusMessage }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Form>
</template>

<script setup lang="ts">
import { VALIDATION_RULES } from '@/config/client/wizard/validation';
import type { ClientDocuments } from '@/types/client/wizard';
import { VerificationStatus } from '@/types/client/wizard';

interface Props {
    modelValue: ClientDocuments;
    validation?: {
        getFieldError: (field: string) => string | undefined;
        touchField: (field: string) => void;
    };
}

const props = withDefaults(defineProps<Props>(), {
    validation: undefined
});

const emit = defineEmits<{
    'update:modelValue': [value: ClientDocuments];
    'valid': [value: boolean];
}>();

// État local
const formData = ref<ClientDocuments>({ ...props.modelValue });

// Status de vérification
const verificationStatusClasses = computed(() => {
    switch (formData.value.verification_status) {
        case VerificationStatus.VERIFIED:
            return 'bg-green-50 text-green-800';
        case VerificationStatus.REJECTED:
            return 'bg-red-50 text-red-800';
        default:
            return 'bg-yellow-50 text-yellow-800';
    }
});

const verificationStatusIcon = computed(() => {
    switch (formData.value.verification_status) {
        case VerificationStatus.VERIFIED:
            return 'heroicons:check-circle';
        case VerificationStatus.REJECTED:
            return 'heroicons:x-circle';
        default:
            return 'heroicons:clock';
    }
});

const verificationStatusMessage = computed(() => {
    switch (formData.value.verification_status) {
        case VerificationStatus.VERIFIED:
            return 'Documents vérifiés et validés';
        case VerificationStatus.REJECTED:
            return 'Documents rejetés - Veuillez les vérifier et les soumettre à nouveau';
        default:
            return 'Documents en cours de vérification';
    }
});

// Validation des champs
const validateFields = (data: ClientDocuments): boolean => {
    // Vérifier la présence de tous les documents requis
    if (
        !data.identity_card ||
        !data.proof_of_address ||
        !data.bank_details ||
        !data.income_declaration ||
        !data.tax_notice
    ) {
        return false;
    }

    // La vérification finale doit être effectuée par le back-office
    return true;
};

// Observateurs
watch(formData, (newValue) => {
    emit('update:modelValue', newValue);
    const isValid = validateFields(newValue);
    emit('valid', isValid);
}, { deep: true });

// Méthodes
const handleSubmit = (data: ClientDocuments) => {
    const isValid = validateFields(data);
    emit('valid', isValid);
};
</script>