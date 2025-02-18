<template>
    <div class="mb-6">
        <label :for="name" class="">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <input
            :type="type"
            :id="name"
            :name="name"
            :value="modelValue"
            @input="handleInput"
            @blur="handleBlur"
            :required="required"
            :aria-invalid="!!error"
            :aria-describedby="error ? `${name}-error` : undefined"
            :class="[
                'form-input',
                { 'border-red-500': error }
            ]"
            v-bind="$attrs"
        />
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
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
    modelValue: string| number | null | undefined ;
    required?: boolean;
    error?: string;
    help?: string;
}

// Gestion des attributs personnalisés
defineOptions({
    inheritAttrs: false
});

withDefaults(defineProps<Props>(), {
    type: 'text',
    required: false,
    error: '',
    help: ''
});

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'blur': [event: FocusEvent]
}>();

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
};
</script>