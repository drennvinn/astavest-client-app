<template>
    <div class="mb-6">
        <label :for="name" class="block">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <select
            :id="name"
            :name="name"
            :value="modelValue"
            @change="handleChange"
            @blur="handleBlur"
            :required="required"
            :aria-invalid="!!error"
            :aria-describedby="error ? `${name}-error` : undefined"
            :class="[
                'form-select w-full rounded-lg p-2 border border-gray-300 outline-none focus:border-orange-500 transition-all duration-600 ease-in-out',
                { 'border-red-500': error }
            ]"
            v-bind="$attrs"
        >
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
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
    value: string;
    label: string;
}

interface Props {
    label: string;
    name: string;
    options: Option[];
    modelValue: string | null | undefined;
    required?: boolean;
    error?: string;
    help?: string;
}

defineOptions({
    inheritAttrs: false
});

withDefaults(defineProps<Props>(), {
    required: false,
    error: '',
    help: ''
});

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'blur': [event: FocusEvent]
}>();

const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
};
</script>