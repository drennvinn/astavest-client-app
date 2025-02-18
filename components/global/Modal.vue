<!-- Modal.vue -->
<template>
    <TransitionRoot appear :show="modelValue" as="template">
        <Dialog
            as="div"
            @close="closeOnClickOutside && $emit('update:modelValue', false)"
            class="relative z-[51]"
        >
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <DialogOverlay class="fixed inset-0 bg-[black]/60" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center px-4 py-8">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel
                            class="panel w-full overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark"
                            :class="[size === 'lg' ? 'max-w-lg' : size === 'xl' ? 'max-w-xl' : 'max-w-md']"
                        >
                            <button
                                v-if="showClose"
                                type="button"
                                class="absolute top-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600 ltr:right-4 rtl:left-4"
                                @click="$emit('update:modelValue', false)"
                            >
                                <icon-x />
                            </button>
                            <div
                                v-if="title"
                                class="bg-[#fbfbfb] py-3 text-lg font-bold dark:bg-[#121c2c] ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5"
                            >
                                {{ title }}
                            </div>
                            <div class="p-5">

                                <!-- Contenu principal -->
                                <slot></slot>
                                <!-- ----------------- -->

                                <!-- Footer avec boutons -->
                                <div v-if="$slots.footer || showFooter" class="mt-8 flex items-center justify-end">
                                    <slot name="footer">
                                        <button
                                            v-if="showCancel"
                                            type="button"
                                            @click="$emit('update:modelValue', false)"
                                            class="btn btn-outline-danger"
                                        >
                                            {{ cancelText }}
                                        </button>
                                        <button
                                            v-if="showConfirm"
                                            type="button"
                                            @click="handleConfirm"
                                            class="btn btn-primary ltr:ml-4 rtl:mr-4"
                                        >
                                            {{ confirmText }}
                                        </button>
                                    </slot>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogOverlay } from '@headlessui/vue';

// Props
interface Props {
    modelValue: boolean;
    title?: string;
    size?: 'md' | 'lg' | 'xl';
    showClose?: boolean;
    showFooter?: boolean;
    showCancel?: boolean;
    showConfirm?: boolean;
    cancelText?: string;
    confirmText?: string;
    closeOnClickOutside?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    title: '',
    size: 'md',
    showClose: true,
    showFooter: true,
    showCancel: true,
    showConfirm: true,
    cancelText: 'Annuler',
    confirmText: 'Confirmer',
    closeOnClickOutside: true,
});

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    'confirm': [data?: any];  // ou un type plus spécifique selon vos besoins
    'cancel': [];  // ajouter un événement cancel explicite
}>();

// Methods
const handleConfirm = () => {
    emit('confirm');
    emit('update:modelValue', false);
};
</script>