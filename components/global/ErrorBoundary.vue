<!-- components/ErrorBoundary.vue -->
<template>
    <div>
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
                <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-500 mr-2" />
                <p class="text-red-700">Une erreur est survenue lors du chargement du composant</p>
            </div>
            <button
                @click="resetError"
                class="mt-2 text-sm text-red-500 hover:text-red-700"
            >
                Réessayer
            </button>
        </div>
        <slot v-else></slot>
    </div>
</template>

<script setup lang="ts">
const error = ref(false);
const resetError = () => {
    error.value = false;
};

onErrorCaptured((e: Error) => {
    error.value = true;
    console.error('Erreur capturée :', e);
    return false; // empêche la propagation de l'erreur
});
</script>