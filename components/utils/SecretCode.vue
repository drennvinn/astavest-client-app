<template>
    <div class="flex justify-center">
        <input
            type="tel"
            maxlength="1"
            class="
                h-10 w-10 mr-4
                text-center
                rounded-lg
                bg-gray-300
                outline-none
                focus:ring-4 focus:ring-orange-500
            "
            :class="{'mr-0': index === secretCodeArray.length - 1}"
            v-for="(digit, index) in secretCodeArray" :key="index"
            v-model="secretCodeArray[index]"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
        />
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:modelValue']);
const secretCodeArray = ref(Array.from({ length: 6 }, () => ''));

const props = withDefaults(defineProps(), {
    modelValue: {
        type: String,
        default: '',
    },
});

watchEffect(() => {
    emit('update:modelValue', secretCodeArray.value.join(''));
    if (props.modelValue) {
        secretCodeArray.value = Array.from(props.modelValue);
    }
});

/**
 * handleInput: Handles changes on input and updates the secret code array
 * @param {number} index - The index of the input in the array
 * @param {Event} event - The input event
 */
const handleInput = (index: number, event:Event) => {
    const value = (event.target as HTMLInputElement).value;
    secretCodeArray.value[index] = value;
    emit('update:modelValue', secretCodeArray.value.join(''));
};

/**
 * handleKeydown: Handles keydown events on input for seamless user experience
 * @param {number} index - The index of the input in the array
 * @param {KeyboardEvent} event - The keyboard event
 */
 const handleKeydown = (index: number, event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;

    if (/^\d$/.test(event.key)) { // check if the key is a single digit
        if (index < secretCodeArray.value.length - 1) {
            secretCodeArray.value[index] = event.key;
            nextTick(() => {
                (target.nextElementSibling as HTMLInputElement)?.focus();
            });
            event.preventDefault();
        }
    } else if (event.key === 'Backspace') {
        if (index > 0) {
            secretCodeArray.value[index] = '';
            secretCodeArray.value[index-1] = ''; // Clear the previous element on Backspace
            nextTick(() => {
                (target.previousElementSibling as HTMLInputElement)?.focus();
            });
        } else if (index === 0) {
            secretCodeArray.value[index] = '';
        }
        event.preventDefault();
    }
};

</script>
