// composables/usePageTransition.ts
import { ref, computed } from 'vue'
import { useAppStore } from '~/stores/useAppStore'

export const usePageTransition = () => {
    const store = useAppStore()
    const isAnimating = ref(false)
    const animationTimeout = ref<NodeJS.Timeout | null>(null)

    const startTransition = () => {
        // Annuler le timeout précédent s'il existe
        if (animationTimeout.value) {
            clearTimeout(animationTimeout.value)
        }

        isAnimating.value = true

        // Assurer que l'animation est retirée après un délai
        // même si l'événement animationend n'est pas déclenché
        animationTimeout.value = setTimeout(() => {
            endTransition()
        }, 1000) // Délai de sécurité
    }

    const endTransition = () => {
        isAnimating.value = false
        if (animationTimeout.value) {
            clearTimeout(animationTimeout.value)
            animationTimeout.value = null
        }
    }

    // Nettoyage lors de la destruction du composant
    onBeforeUnmount(() => {
        if (animationTimeout.value) {
            clearTimeout(animationTimeout.value)
        }
    })

    return {
        startTransition,
        endTransition,
        isAnimating: computed(() => isAnimating.value),
        currentAnimation: computed(() => store.animation)
    }
}