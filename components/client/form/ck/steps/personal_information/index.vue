<template>
    <Form
        :initial-data="modelValue"
        :rules="VALIDATION_RULES.personal_information"
        :custom-submit-btn="true"
        @submit="handleSubmit"
    >
        <template #default="{ errors, touchField, getFieldError }">
            <div class="space-y-8">
                <!-- Description de l'étape -->
                <!-- <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-gray-600">
                        Ces informations sont nécessaires pour la création de votre compte et
                        sont exigées par la réglementation financière.
                    </p>
                </div> -->

                <!-- Civilité -->
                <FormRadio
                    name="civility"
                    label="Civilité"
                    v-model="formData.civility"
                    :options="[
                        { value: 'mr', label: 'Monsieur' },
                        { value: 'mrs', label: 'Madame' }
                    ]"
                    :error="getFieldError('civility')"
                    required
                    @blur="touchField('civility')"
                />

                <!-- Identité -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Nom -->
                    <!-- <FormInput
                        name="lastname"
                        label="Nom"
                        v-model="formData.lastname"
                        :error="getFieldError('lastname')"
                        required
                        @blur="touchField('lastname')"
                    /> -->

                    <!-- Prénom -->
                    <!-- <FormInput
                        name="firstname"
                        label="Prénom"
                        v-model="formData.firstname"
                        :error="getFieldError('firstname')"
                        required
                        @blur="touchField('firstname')"
                    /> -->

                    <!-- Date de naissance -->
                    <FormInput
                        name="birth_date"
                        label="Date de naissance"
                        type="date"
                        v-model="formData.birth_date"
                        :error="getFieldError('birth_date')"
                        :max="maxBirthDate"
                        required
                        @blur="touchField('birth_date')"
                        help="Vous devez avoir au moins 18 ans"
                    />
                </div>

                <!-- Coordonnées -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Email -->
                    <!-- <FormInput
                        name="email"
                        type="email"
                        label="Email"
                        v-model="formData.email"
                        :error="getFieldError('email')"
                        required
                        @blur="touchField('email')"
                    /> -->

                    <!-- Téléphone -->
                    <FormInput
                        name="phone"
                        type="tel"
                        label="Téléphone"
                        v-model="formData.phone"
                        :error="getFieldError('phone')"
                        required
                        @blur="touchField('phone')"
                        help="Format: +33 6 12 34 56 78"
                    />
                </div>

                <!-- Adresse -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Adresse</h3>

                    <FormInput
                        name="address"
                        label="Adresse"
                        v-model="formData.address"
                        :error="getFieldError('address')"
                        required
                        @blur="touchField('address')"
                        class="col-span-2"
                    />

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            name="postal_code"
                            label="Code postal"
                            v-model="formData.postal_code"
                            :error="getFieldError('postal_code')"
                            required
                            @blur="touchField('postal_code')"
                        />

                        <FormInput
                            name="city"
                            label="Ville"
                            v-model="formData.city"
                            :error="getFieldError('city')"
                            required
                            @blur="touchField('city')"
                        />
                    </div>

                    <FormSelect
                        name="country"
                        label="Pays"
                        v-model="formData.country"
                        :options="countryOptions"
                        :error="getFieldError('country')"
                        required
                        @blur="touchField('country')"
                    />
                </div>

                <!-- PEP (Personne Politiquement Exposée) -->
                <div class="space-y-6">
                    <h3 class="text-lg font-medium">Informations réglementaires</h3>

                    <FormRadio
                        name="is_pep"
                        label="Êtes-vous une Personne Politiquement Exposée (PPE) ?"
                        v-model="formData.is_pep"
                        :options="[
                            { value: 'yes', label: 'Oui' },
                            { value: 'no', label: 'Non' }
                        ]"
                        :error="getFieldError('is_pep')"
                        required
                        @blur="touchField('is_pep')"
                        help="Une PPE est une personne qui exerce ou a exercé des fonctions publiques importantes"
                    />

                    <!-- Informations PEP conditionnelles -->
                    <div v-if="formData.is_pep === 'yes'" class="space-y-6 pl-6 border-l-2 border-gray-100">
                        <FormInput
                            name="function_exercised"
                            label="Fonction exercée"
                            v-model="formData.function_exercised"
                            :error="getFieldError('function_exercised')"
                            required
                            @blur="touchField('function_exercised')"
                        />

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                name="function_entry_date"
                                label="Date de début de fonction"
                                type="date"
                                v-model="formData.function_entry_date"
                                :error="getFieldError('function_entry_date')"
                                required
                                @blur="touchField('function_entry_date')"
                            />

                            <FormInput
                                name="function_exit_date"
                                label="Date de fin de fonction"
                                type="date"
                                v-model="formData.function_exit_date"
                                :error="getFieldError('function_exit_date')"
                                :min="formData.function_entry_date || undefined"
                                @blur="touchField('function_exit_date')"
                            />
                        </div>

                        <FormSelect
                            name="function_country"
                            label="Pays de la fonction"
                            v-model="formData.function_country"
                            :options="countryOptions"
                            :error="getFieldError('function_country')"
                            required
                            @blur="touchField('function_country')"
                        />
                    </div>
                </div>

                <!-- Protection juridique -->
                <div class="space-y-6">
                    <FormRadio
                        name="protection_regime"
                        label="Êtes-vous sous un régime de protection juridique ?"
                        v-model="formData.protection_regime"
                        :options="[
                            { value: 'yes', label: 'Oui' },
                            { value: 'no', label: 'Non' }
                        ]"
                        :error="getFieldError('protection_regime')"
                        required
                        @blur="touchField('protection_regime')"
                    />

                    <!-- Informations de protection juridique conditionnelles -->
                    <div v-if="formData.protection_regime === 'yes'" class="space-y-6 pl-6 border-l-2 border-gray-100">
                        <FormSelect
                            name="protection_type"
                            label="Type de protection"
                            v-model="formData.protection_type"
                            :options="protectionTypeOptions"
                            :error="getFieldError('protection_type')"
                            required
                            @blur="touchField('protection_type')"
                        />

                        <FormInput
                            name="legal_representative"
                            label="Représentant légal"
                            v-model="formData.legal_representative"
                            :error="getFieldError('legal_representative')"
                            required
                            @blur="touchField('legal_representative')"
                        />
                    </div>
                </div>
            </div>
        </template>
    </Form>
</template>

<script setup lang="ts">
import { VALIDATION_RULES } from '~/config/client/wizard/validation';
import type { PersonalInformation } from '~/types/client/wizard';

interface Props {
    modelValue: PersonalInformation;
    validation?: {
        getFieldError: (field: string) => string | undefined;
        touchField: (field: string) => void;
    };
}

const props = withDefaults(defineProps<Props>(), {
    validation: undefined
});

const emit = defineEmits<{
    'update:modelValue': [value: PersonalInformation];
    'valid': [value: boolean];
}>();

// État local
const formData = ref<PersonalInformation>({ ...props.modelValue });

// Options
const countryOptions = [
    { value: 'FR', label: 'France' },
    { value: 'BE', label: 'Belgique' },
    { value: 'CH', label: 'Suisse' },
    { value: 'LU', label: 'Luxembourg' },
    { value: 'MC', label: 'Monaco' },
];

const protectionTypeOptions = [
    { value: 'tutelle', label: 'Tutelle' },
    { value: 'curatelle', label: 'Curatelle' },
    { value: 'sauvegarde', label: 'Sauvegarde de justice' },
];

// Date du jour pour limiter la date de naissance
const maxBirthDate = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
});

// Observateurs
watch(formData, (newValue) => {
    emit('update:modelValue', newValue);
}, { deep: true });

// Méthodes
const handleSubmit = (data: PersonalInformation) => {
    emit('valid', true);
};
</script>