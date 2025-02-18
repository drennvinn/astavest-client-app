<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>

<template>
    <div class="panel">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">Advisor</h5>
        </div>
        <div class="mb-5">
            <div class="flex flex-col items-center justify-center">
                <!-- <img :src="`${runtimeConfig.public.directusUrl}assets/${client?.user?.avatar}`" class="mb-5 h-28 w-28 rounded-full object-cover" /> -->
                <!-- <p class="text-xl font-semibold text-primary">{{ auth_store.getFullName }}</p> -->
            </div>
            <ul class="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">

            </ul>
        </div>
    </div>
</template>