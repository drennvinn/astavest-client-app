<template>
    <div class="mb-6">
        <label class="inline-flex items-center">
            <input
                type="checkbox"
                :name="name"
                :value="value"
                :checked="isChecked"
                @change="handleChange"
                @blur="handleBlur"
                :aria-invalid="!!error"
                :aria-describedby="error ? `${name}-error` : undefined"
                :class="[
                    'rounded shadow-sm text-orange-500 border-gray-300 focus:border-orange-300 focus:ring focus:ring-offset-0 focus:ring-orange-100 focus:ring-opacity-50',
                    { 'border-red-500': error }
                ]"
                v-bind="$attrs"
            />
            <span class="ml-2">
                {{ label }}
                <span v-if="required" class="text-red-500">*</span>
            </span>
        </label>
        <p v-if="help" class="mt-1 text-sm text-gray-500">{{ help }}</p>
        <span
            v-if="error"
            :id="`${name}-error`"
            class="text-red-500 text-sm"
        >{{ error }}</span>
    </div>
</template>

<script setup lang="ts">
interface Props {
    label: string;
    name: string;
    modelValue: string | boolean | null;
    value?: string | boolean;
    required?: boolean;
    error?: string;
    help?: string;
}

defineOptions({
    inheritAttrs: false
});

const props = withDefaults(defineProps<Props>(), {
    value: true,
    required: false,
    error: '',
    help: ''
});

const emit = defineEmits<{
    'update:modelValue': [value: string | boolean]
    'blur': [event: FocusEvent]
}>();

const isChecked = computed(() => {
    if (typeof props.value === 'boolean') {
        return props.modelValue === props.value;
    }
    return props.modelValue === props.value || props.modelValue === true;
});

const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
};

const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
};




/**
 * ///////////////////////////////////////////
 * // Example of usage: /////////////////////
 * /////////////////////////////////////////
 *

1) agree to the terms of use:
=================================

 <FormCheckbox
    v-model="formData.agreement"
    value="agreed"
    label="J'accepte les conditions d'utilisation"
    name="agreement"
    :error="getFieldError('agreement')"
    @blur="touchField('agreement')"
/>


2) interests:
=================================

<FormCheckbox
    v-model="formData.interests"
    value="sports"
    label="Sports"
    name="interests"
    :error="getFieldError('interests')"
    @blur="touchField('interests')"
/>
<FormCheckbox
    v-model="formData.interests"
    value="music"
    label="Musique"
    name="interests"
    :error="getFieldError('interests')"
    @blur="touchField('interests')"
/>
<FormCheckbox
    v-model="formData.interests"
    value="travel"
    label="Voyage"
    name="interests"
    :error="getFieldError('interests')"
    @blur="touchField('interests')"
/>

 */
</script>
