<template>
    <div class="rounded-md bg-white dark:bg-black">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { AccordionBehavior, AccordionKey, type AccordionContext } from '~/types/accordion';


/**
 * @property {AccordionBehavior} behavior - Defines how the accordion sections interact
 * @property {number[]} modelValue - Array of open section IDs for v-model binding
 * @property {number} transitionDuration - Duration of open/close animations in milliseconds
 */
const props = defineProps({
    behavior: {
        type: String as PropType<AccordionBehavior>,
        validator: (value: string) => Object.values(AccordionBehavior).includes(value as AccordionBehavior),
        default: AccordionBehavior.Single
    },
    modelValue: {
        type: Array as PropType<number[]>,
        default: () => []
    },
    transitionDuration: {
        type: Number,
        default: 300
    }
});

const { behavior, modelValue } = toRefs(props);
/**
 * Set of currently open accordion item IDs
 * @type {Set<number>}
 */
const openItems = ref<Set<number>>(new Set(modelValue.value));
const nextId = ref(0);
const emit = defineEmits<{
    (e: 'update:modelValue', value: number[]): void;
    (e: 'change', openItems: Set<number>): void;
}>();


/**
 * Sync the openItems set with the v-model value
 */
watch(() => props.modelValue, (newValue) => {
    if (newValue) openItems.value = new Set(newValue);
}, { deep: true });

// Observer les changements d'items ouverts
watchEffect(() => {
    emit('change', openItems.value);
    emit('update:modelValue', Array.from(openItems.value));
});

/**
 * Generate a unique ID for a new accordion item
 * @returns {number} New unique ID
 */
const getNextId = (): number => {
    const id = nextId.value;
    nextId.value++;
    return id;
};


/**
 * Toggle the state of an accordion item based on the current behavior
 * @param {number} id - ID of the accordion item to toggle
 */
const toggleItem = (id: number) => {
    switch (behavior.value) {
        case AccordionBehavior.Single:
            if (openItems.value.has(id)) {
                openItems.value.clear();
            } else {
                openItems.value.clear();
                openItems.value.add(id);
            }
            break;

        case AccordionBehavior.Multiple:
            if (openItems.value.has(id)) {
                openItems.value.delete(id);
            } else {
                openItems.value.add(id);
            }
            break;

        case AccordionBehavior.ToggleAll:
            if (!openItems.value.has(id)) {
                for (let i = 0; i < nextId.value; i++) {
                    openItems.value.add(i);
                }
            } else {
                openItems.value.clear();
            }
            break;
    }
};

// Provide context to child AccordionItem components
provide<AccordionContext>(AccordionKey, {
    registerItem: getNextId,
    isOpen: (id: number) => openItems.value.has(id),
    toggle: toggleItem,
    nextId: readonly(nextId),
    transitionDuration: props.transitionDuration
});
</script>
