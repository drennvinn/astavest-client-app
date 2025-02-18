<template>
    <div class="divide-y divide-white-light dark:divide-dark">
        <button
            class="flex w-full cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold hover:bg-primary-light hover:text-primary dark:text-white dark:hover:bg-[#1B2E4B] dark:hover:text-primary"
            :class="{
                'bg-primary-light !text-primary dark:bg-[#1B2E4B]': isOpen,
                'opacity-50 cursor-not-allowed': disabled
            }"
            :aria-expanded="isOpen"
            :aria-controls="`accordion-content-${id}`"
            :aria-disabled="disabled"
            :disabled="disabled"
            @click="!disabled && toggle()"
            @keydown.arrow-down.prevent="focusNextItem"
            @keydown.arrow-up.prevent="focusPreviousItem"
        >
            <span>
                <slot name="title">Section {{ id + 1 }}</slot>
            </span>
            <span class="shrink-0">
                <slot name="icon-open" v-if="isOpen">
                    <icon-minus-circle :fill="true" />
                </slot>
                <slot name="icon-closed" v-else>
                    <icon-plus-circle :duotone="false" />
                </slot>
            </span>
        </button>
        <div
            role="region"
            :aria-labelledby="`accordion-button-${id}`"
            :id="`accordion-content-${id}`"
            class="overflow-hidden"
            :style="{
                maxHeight: isOpen ? `${contentHeight}px` : '0px',
                transition: `max-height ${accordion.transitionDuration}ms ease-in-out`
            }"
        >
            <div ref="content" class="px-1 py-3">
                <div class="text-sm text-white-dark font-semibold">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AccordionKey } from '~/types/accordion';

/**
 * Props for the AccordionItem component
 * @typedef {Object} AccordionItemProps
 * @property {boolean} disabled - Whether the accordion item is disabled
 */
const props = defineProps({
    disabled: {
        type: Boolean as PropType<boolean>,
        default: false
    }
});

/**
 * Inject the accordion context from parent
 * @throws {Error} If AccordionItem is used outside of an Accordion component
 */
const accordion = inject(AccordionKey);
if (!accordion) {
    throw new Error('AccordionItem must be used within Accordion');
}


const id = ref(0);
const content = shallowRef<HTMLElement | null>(null);
const contentHeight = shallowRef(0);
const isOpen = computed(() => accordion.isOpen(id.value));
const isLastItem = computed(() => id.value === accordion.nextId.value - 1);
const accordionRef = ref<HTMLElement | null>(null);

// Get all accordion buttons for keyboard navigation
const buttons = computed(() => {
    if (!accordionRef.value) return [];
    return Array.from(accordionRef.value.querySelectorAll('[aria-controls^="accordion-content-"]'));
});

// Toggle the open state of this accordion item
const toggle = () => {
    accordion.toggle(id.value);
    updateContentHeight();
};

/**
 * Move focus to the next accordion item
 * Implements keyboard navigation for accessibility
 */
const focusNextItem = () => {
    const currentIndex = buttons.value.findIndex(button =>
        button.getAttribute('aria-controls') === `accordion-content-${id.value}`
    );
    const nextButton = buttons.value[currentIndex + 1] as HTMLElement;
    if (nextButton) {
        nextButton.focus();
    }
};

/**
 * Move focus to the previous accordion item
 * Implements keyboard navigation for accessibility
 */
const focusPreviousItem = () => {
    const currentIndex = buttons.value.findIndex(button =>
        button.getAttribute('aria-controls') === `accordion-content-${id.value}`
    );
    const prevButton = buttons.value[currentIndex - 1] as HTMLElement;
    if (prevButton) {
        prevButton.focus();
    }
};

/**
 * Update the content height for smooth animations
 */
const updateContentHeight = () => {
    if (content.value) {
        contentHeight.value = content.value.scrollHeight;
    }
};


watch(content, updateContentHeight);

let observer: MutationObserver | null = null;

onMounted(() => {
    id.value = accordion.registerItem();
    updateContentHeight();

    // Observer pour les changements de contenu
    if (content.value) {
        observer = new MutationObserver(() => updateContentHeight());
        observer.observe(content.value, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});

</script>
