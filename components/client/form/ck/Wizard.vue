<template>
    <ClientOnly>
        <div class="max-w-4xl mx-auto p-4 space-y-8">
            <!-- Accordéon des étapes -->
            <div class="space-y-4">
                <div
                    v-for="(step, index) in orderedSteps"
                    :key="step"
                    class="border rounded-lg overflow-hidden"
                    :class="[
                        store.currentStep === step ? 'border-orange-500' : 'border-gray-200',
                        { 'bg-gray-50': !store.canNavigateToStep(step) }
                    ]"
                >
                    <!-- En-tête de l'étape -->
                    <div
                        class="flex items-center p-4 cursor-pointer"
                        :class="[
                            store.canNavigateToStep(step) ? 'hover:bg-gray-50' : 'cursor-not-allowed'
                        ]"
                        @click="store.canNavigateToStep(step) && navigateToStep(step)"
                    >
                        <!-- Indicateur d'état -->
                        <div
                            class="flex items-center justify-center w-8 h-8 rounded-full transition-colors mr-4"
                            :class="getStepIndicatorClass(step)"
                        >
                            <Icon
                                v-if="hasStepErrors(step)"
                                name="heroicons:exclamation-circle"
                                class="w-5 h-5 text-white"
                                aria-label="Erreur dans cette étape"
                            />
                            <Icon
                                v-else-if="store.isStepValid(step)"
                                name="heroicons:check"
                                class="w-5 h-5 text-white"
                                aria-label="Étape validée"
                            />
                            <span v-else>{{ index + 1 }}</span>
                        </div>

                        <!-- Titre et description -->
                        <div class="flex-grow">
                            <h2 class="text-lg font-medium" :class="getStepTextClass(step)">
                                {{ STEP_CONFIG[step].title }}
                            </h2>
                            <p class="text-sm text-gray-500">
                                {{ STEP_CONFIG[step].description }}
                            </p>
                        </div>

                        <!-- Indicateur de progression -->
                        <div class="ml-4 flex items-center">
                            <!-- <template v-if="store.isStepValid(step)">
                                <Icon
                                    name="heroicons:check-circle"
                                    class="w-6 h-6 text-green-500"
                                />
                            </template> -->
                            <Icon
                                :name="store.currentStep === step ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
                                class="w-6 h-6 text-gray-400"
                            />
                        </div>
                    </div>

                    <!-- Contenu de l'étape -->
                    <div class="border-t border-gray-200">
                        <Transition
                            name="fade"
                            mode="out-in"
                        >
                            <div v-if="store.currentStep === step" class="p-4">
                                <ErrorBoundary>
                                    <Suspense>
                                        <template #default>
                                            <component
                                                :is="getCurrentStepComponent"
                                                :key="`step-${store.currentStep}`"
                                                v-model="currentStepModelValue"
                                                :validation="validationApi"
                                                @valid="handleStepValidation"
                                            />
                                        </template>
                                        <template #fallback>
                                            <div class="flex justify-center p-8">
                                                <span class="animate-spin w-8 h-8 border-4 border-t-orange-500 border-orange-200 rounded-full"></span>
                                            </div>
                                        </template>
                                    </Suspense>
                                </ErrorBoundary>

                                <!-- Boutons de navigation -->
                                <div class="flex justify-between mt-8">
                                    <button
                                        @click="goToPreviousStep"
                                        :disabled="!canGoPrevious"
                                        class="px-6 py-2 rounded-lg transition-colors flex items-center"
                                        :class="buttonClasses.previous"
                                    >
                                        <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
                                        Précédent
                                    </button>

                                    <button
                                        @click="handleNextStep"
                                        :disabled="!canGoNext || !store.isStepValid(store.currentStep)"
                                        class="px-6 py-2 rounded-lg transition-colors flex items-center"
                                        :class="buttonClasses.next"
                                    >
                                        {{ isLastStep ? 'Terminer' : 'Suivant' }}
                                        <Icon
                                            v-if="!isLastStep"
                                            name="heroicons:arrow-right"
                                            class="w-5 h-5 ml-2"
                                        />
                                    </button>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>

            <!-- Modal de confirmation -->
            <Modal
                v-model="navigationState.showExitConfirmation"
                :title="'Confirmation de navigation'"
            >
                <template #default>
                    <p class="text-gray-600">
                        Certaines modifications n'ont pas été sauvegardées.
                        Voulez-vous vraiment quitter cette étape ?
                    </p>
                </template>
                <template #actions>
                    <div class="flex justify-end space-x-4">
                        <button
                            @click="cancelNavigation"
                            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            @click="confirmNavigation"
                            class="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors"
                        >
                            Confirmer
                        </button>
                    </div>
                </template>
            </Modal>
        </div>
    </ClientOnly>
</template>

<script setup lang="ts">
import type { StepKey } from '~/types/client/wizard';
import { STEP_CONFIG } from '~/config/client/wizard/steps';
import { useClientWizardStore } from '~/stores/clientWizardStore';
import { useWizardNavigation } from '~/composables/client/useWizardNavigation';
import { useWizardValidation } from '~/composables/client/useWizardValidation';
import { useStepComponents } from '~/composables/client/useStepComponents';



// Store et composables
const store = useClientWizardStore();
const {
    navigationState,
    orderedSteps,
    canGoNext,
    canGoPrevious,
    isLastStep,
    navigateToStep,
    goToNextStep,
    goToPreviousStep,
    confirmNavigation,
    cancelNavigation
} = useWizardNavigation();

const {
    validateStep,
    getFieldError,
    touchField,
    hasStepErrors,
} = useWizardValidation();



// Computed pour les classes des boutons
const buttonClasses = computed(() => ({
    previous: [
        canGoPrevious.value
            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
    ],
    next: [
        canGoNext.value && store.isStepValid(store.currentStep)
            ? 'bg-orange-500 hover:bg-orange-600 text-white'
            : 'bg-orange-200 text-white cursor-not-allowed'
    ]
}));

// Méthodes pour l'animation de l'accordéon
// const startTransition = (el: Element) => {
//     el.style.height = '0';
//     void el.offsetHeight; // Force reflow
//     el.style.height = el.scrollHeight + 'px';
// };

// const endTransition = (el: Element) => {
//     el.style.height = el.scrollHeight + 'px';
//     void el.offsetHeight; // Force reflow
//     el.style.height = '0';
// };



// Données de débogage formatées
// const debugData = computed(() =>
//     JSON.stringify({
//         currentStep: store.currentStep,
//         progress: store.formProgress,
//         isComplete: store.isFormComplete,
//         hasUnsavedChanges: store.hasUnsavedChanges,
//         steps: store.steps
//     }, null, 2)
// );



// Computed
const currentStepConfig = computed(() => STEP_CONFIG[store.currentStep]);

const { stepComponents } = useStepComponents({
    loadingDelay: 200,
    timeout: 10000,
    maxRetries: 3
});

const getCurrentStepComponent = computed(() =>
    stepComponents[store.currentStep]
);

const currentStepModelValue = computed({
    get: () => store.steps[store.currentStep].data,
    set: (newValue) => store.updateStepData(store.currentStep, newValue)
});

// const formatLastSaved = computed(() => {
//     if (!store.lastSaved) return '';
//     return new Date(store.lastSaved).toLocaleString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });
// });

// API de validation exposée aux composants enfants
const validationApi = {
    getFieldError,
    touchField,
    hasStepErrors
};

// Méthodes
const handleStepValidation = async (isValid: boolean) => {
    if (isValid) {
        await validateStep(store.currentStep);
    }
};

const handleNextStep = async () => {
    if (isLastStep.value) {
        await handleSubmit();
    } else {
        await goToNextStep();
    }
};

const handleSubmit = async () => {
    try {
        await store.submitForm();
        // Rediriger vers la page de succès
        navigateTo('/success');
    } catch (error) {
        console.error('Erreur lors de la soumission:', error);
    }
};

// Classes conditionnelles
const getStepIndicatorClass = (step: StepKey) => {
    if (hasStepErrors(step)) {
        return 'bg-red-500 text-white';
    }
    if (step === store.currentStep) {
        return 'bg-orange-500 text-white';
    }
    if (store.isStepValid(step)) {
        return 'bg-green-500 text-white';
    }
    return 'bg-gray-200 text-gray-600';
};

const getStepTextClass = (step: StepKey) => {
    if (hasStepErrors(step)) {
        return 'text-red-600';
    }
    if (step === store.currentStep) {
        return 'text-orange-600';
    }
    if (store.isStepValid(step)) {
        return 'text-green-600';
    }
    return 'text-gray-500';
};

const getStepConnectorClass = (step: StepKey) => {
    if (hasStepErrors(step)) {
        return 'bg-red-200';
    }
    if (store.isStepValid(step)) {
        return 'bg-green-500';
    }
    return 'bg-gray-200';
};
</script>






<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all .3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>