<template>
    <div class="mb-6">
        <label :for="name" class="block">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>
        <textarea
            :id="name"
            :name="name"
            :rows="rows"
            :value="modelValue"
            @input="handleInput"
            @blur="handleBlur"
            :required="required"
            :aria-invalid="!!error"
            :aria-describedby="error ? `${name}-error` : undefined"
            :class="[
                'form-textarea w-full p-2 rounded-md outline-none border border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500',
                { 'border-red-500': error }
            ]"
            v-bind="$attrs"
        ></textarea>
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
    modelValue: string;
    rows?: number;
    required?: boolean;
    error?: string;
    help?: string;
}

defineOptions({
    inheritAttrs: false
});

withDefaults(defineProps<Props>(), {
    rows: 4,
    required: false,
    error: '',
    help: ''
});

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'blur': [event: FocusEvent]
}>();

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
};
</script>