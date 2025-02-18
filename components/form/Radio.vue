<template>
    <div class="mb-6">
        <label class="block mb-2">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <div class="space-y-2">
            <div v-for="option in options" :key="option.value" class="inline-flex items-center mr-4">
                <input
                    type="radio"
                    :name="name"
                    :value="option.value"
                    :checked="modelValue === option.value"
                    @change="handleChange"
                    @blur="handleBlur"
                    :required="required"
                    :aria-invalid="!!error"
                    :aria-describedby="error ? `${name}-error` : undefined"
                    :class="[
                        'rounded-full border-gray-300 text-orange-500 shadow-sm focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-200 focus:ring-opacity-50',
                        { 'border-red-500': error }
                    ]"
                    v-bind="$attrs"
                />
                <span class="ml-2">{{ option.label }}</span>
            </div>
        </div>
        <p v-if="help" class="mt-1 text-sm text-gray-500">{{ help }}</p>
        <span
            v-if="error"
            :id="`${name}-error`"
            class="text-red-500 text-sm"
        >{{ error }}</span>
    </div>
</template>

<script setup lang="ts">
interface Option {
    value: any;
    label: string;
}

interface Props {
    name: string;
    label: string;
    modelValue: any;
    options: Option[];
    required?: boolean;
    error?: string;
    help?: string;
}

defineOptions({
    inheritAttrs: false
});

const props = withDefaults(defineProps<Props>(), {
    required: false,
    error: '',
    help: ''
});

const emit = defineEmits<{
    'update:modelValue': [value: any]
    'blur': [event: FocusEvent]
}>();

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value === 'true' ? true : target.value === 'false' ? false : target.value);
};

const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
};


/**
 * ///////////////////////////////////////////
 * // Example of usage: /////////////////////
 * /////////////////////////////////////////
 *

1) Gender:
=================================
<Radio
    name="gender"
    label="Genre"
    v-model="formData.gender"
    :options="[
        { value: 'male', label: 'Homme' },
        { value: 'female', label: 'Femme' },
        { value: 'other', label: 'Autre' }
    ]"
/>



2) Exemple avec validation et message d'erreur:
=================================
<Form
    :rules="rules"
    @submit="onSubmit"
>
    <template #default="{ errors, touchField }">
        <Radio
            name="subscription"
            label="Type d'abonnement"
            v-model="formData.subscription"
            :options="[
                { value: 'monthly', label: 'Mensuel' },
                { value: 'yearly', label: 'Annuel' },
                { value: 'lifetime', label: 'À vie' }
            ]"
            :error="errors.subscription"
            required
            @blur="touchField('subscription')"
        />
    </template>
</Form>

 */
</script>
