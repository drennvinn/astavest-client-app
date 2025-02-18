<template>
    <div
        ref="pageContent"
        class="page-content"
        :class="[
            { 'animate__animated': isAnimating },
            { [currentAnimation]: isAnimating }
        ]"
        @animationend="endTransition">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { usePageTransition } from '~/composables/usePageTransition'
import { useRouter } from 'nuxt/app'

const router = useRouter()
const {
    startTransition,
    endTransition,
    isAnimating,
    currentAnimation
} = usePageTransition()

// Déclencher l'animation à chaque changement de route
router.afterEach(() => {
    startTransition()
})

// Style optionnel pour ajuster la durée des animations
// const style = css`
//   .animate__animated {
//     animation-duration: 0.3s;
//   }

//   .page-content {
//     position: relative;
//     min-height: 100%;
//     width: 100%;
//   }
//   `
</script>