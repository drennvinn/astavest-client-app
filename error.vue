<script setup lang="ts">
// import notFoundImage from "~/assets/img/404-page-image.png";

// const localePath = useLocalePath();

// default props available on error.vue
const props = defineProps({ error: Object });
</script>


<template>
    <main>

        <h1>404 ERROR</h1>
        <NuxtLink to="/">Return to Home</NuxtLink>

    </main>
</template>
