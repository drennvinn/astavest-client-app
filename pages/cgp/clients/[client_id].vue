<script setup lang="ts">
import type { Clients } from '~/types/astavest-crm';

definePageMeta({
    middleware: ['auth']
});

const runtimeConfig = useRuntimeConfig();

const auth_store = useAuth();
// const app_store = useAppStore();

const { $directus, $readItems } = useNuxtApp();

const route = useRoute();
const client = ref<Clients | null>(null);

const loadClientByClientId  = async () => {
    try {
        $directus.refresh();
        const req = await $directus.request<Clients>($readItems('clients', {
            fields: ["*", { user: ["*"] }],
            filter: { client_id: route.params.client_id }
        }));
        client.value = req[0];
    } catch (error: any) {
        console.error('Error loading client data:', error);
    }
}

onMounted( async () => {
    await loadClientByClientId();
});
</script>

<template>
    <div>

        <div class="pt-5">
            <div class="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                <!-- PROFILE CARD -->
                <div class="panel">
                    <div class="mb-5 flex items-center justify-between">
                        <h5 class="text-lg font-semibold dark:text-white-light">Profile</h5>
                    </div>
                    <div class="mb-5">
                        <div class="flex flex-col items-center justify-center">
                            <img :src="`${runtimeConfig.public.directusUrl}assets/${client?.user?.avatar}`" class="mb-5 h-28 w-28 rounded-full object-cover" />
                            <p class="text-xl font-semibold text-primary">{{ client?.user.first_name }}</p>
                        </div>
                        <ul class="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                            <li class="flex items-center gap-2">
                                <icon-calendar class="shrink-0" />
                                {{ client?.date_of_birth }}
                            </li>
                            <li class="flex items-center gap-2">
                                <icon-map-pin class="shrink-0" />
                                {{ client?.city }} {{ client?.zipcode }}
                            </li>
                            <li>
                                <a href="javascript:;" class="flex items-center gap-2">
                                    <icon-mail class="w-5 h-5 shrink-0" />
                                    <span class="truncate text-primary">{{ client?.user?.email }}</span></a
                                >
                            </li>
                            <li class="flex items-center gap-2">
                                <icon-phone />
                                <span class="whitespace-nowrap" dir="ltr">{{ client?.phone }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- END PROFILE CARD -->
            </div>
        </div>

        <!-- <pre>CLIENT {{ client }}</pre> -->

    </div>
</template>