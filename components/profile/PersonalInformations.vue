<script setup lang="ts">
import type { Clients } from '~/types/astavest-crm';
const runtimeConfig = useRuntimeConfig();
defineProps<{
    client_data: Clients
}>();
</script>

<template>
    <div>
        <img :src="`${runtimeConfig.public.directusUrl}assets/${client_data.user?.avatar}`" class="w-44ß h-44 rounded-full" />
        <div class="flex">
            <p class="text-2xl font-bold mt-4">{{ client_data.user?.first_name }} {{ client_data.user?.last_name }}</p>
        </div>
        <div class="flex">
            <Icon name="material-symbols:alternate-email" size="28" />
            <p class="text-lg">{{ client_data.user?.email }}</p>
        </div>
        <div class="flex">
            <Icon name="material-symbols:phone-enabled" size="28" />
            <p class="text-lg">{{ client_data.phone }}</p>
        </div>
        <div class="flex">
            <Icon name="material-symbols:location-city-rounded" size="28" />
            <p class="text-lg">{{ client_data.city }} {{ client_data.zipcode }}</p>
        </div>
        <Icon name="globe" size="28" />
        <p class="text-lg">{{ client_data.country?.name }}</p>
    </div>
</template>