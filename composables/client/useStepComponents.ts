// composables/useStepComponents.ts

import type { StepKey, StepComponentOptions } from '~/types/client/wizard';


export function useStepComponents(options: StepComponentOptions = {}) {
    const {
        loadingDelay = 200,
        timeout = 10000,
        maxRetries = 3
    } = options;

    const LoadingComponent = defineComponent({
        template: `
            <div class="flex justify-center p-8">
                <span class="animate-spin w-8 h-8 border-4 border-t-orange-500 border-orange-200 rounded-full"></span>
            </div>
        `
    });

    const ErrorComponent = defineComponent({
        template: `
            <div class="p-4 bg-red-50 text-red-700 rounded-lg">
                <p>Impossible de charger l'étape</p>
            </div>
        `
    });

    const createStepComponent = (stepKey: StepKey) =>
        defineAsyncComponent({
            loader: () => import(`~/components/client/form/ck/steps/${stepKey}/index.vue`),
            loadingComponent: LoadingComponent,
            errorComponent: ErrorComponent,
            delay: loadingDelay,
            timeout,
            onError(error, retry, fail, attempts) {
                if (attempts <= maxRetries) {
                    retry();
                } else {
                    console.error(`Failed to load step ${stepKey}:`, error);
                    fail();
                }
            }
        });

    const stepComponents = new Proxy({} as Record<StepKey, Component>, {
        get(target, stepKey: StepKey) {
            if (!target[stepKey]) {
                target[stepKey] = createStepComponent(stepKey);
            }
            return target[stepKey];
        }
    });

    return {
        stepComponents
    };
}