<script setup lang="ts">
import type { Clients } from '~/types/astavest-crm';
import DataTable from '~/components/datatable/DataTable.vue';
import type { Column } from "@/types/table";

definePageMeta({
    middleware: ['auth']
});

// const store = useAppStore();
const auth_store = useAuth();

const {
    $directus,
    $readItems,
    // $readFiles
} = useNuxtApp();


const clients = ref<Clients[]>([]);
const isLoading = ref<boolean>(false);

const columns: Column[] = [
    { field: 'client_id', title: 'ID', isUnique: true },
    { field: 'user.first_name', title: 'Prénom', sortable: true },
    { field: 'user.last_name', title: 'Nom', sortable: true },
    { field: 'user.email', title: 'Email', sortable: true },
    { field: 'phone', title: 'Téléphone' },
    // {
    //     field: 'phone',
    //     title: 'Téléphone',
    //     formatter: (value: string) => {
    //     return value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    //     }
    // },
];

const handleSort = (field: string, direction: 'asc' | 'desc') => {
  console.log(`Tri par ${field} en ${direction}`);
};

const handlePageChange = (page: number) => {
  console.log(`Page changée: ${page}`);
};


const loadUserClient = async () => {
    isLoading.value = true;

    try {
        // if (!auth_store.isAuthenticated) await $directus.refresh();
        $directus.refresh();

        const req = await $directus.request<Clients[]>($readItems('clients', {
            fields: ["*", { user: ["*"] }]
        }));
        clients.value = req;
    } catch (error: any) {
        console.error('Error loading clients data:', error);
    } finally {
        isLoading.value = false;
    }
}


onMounted(async () => {
    await loadUserClient();
});

</script>

<template>
    <div>

        <h1>LISTE DES CLIENTS</h1>

        <div class="datatable">
            <DataTable
                :rows="clients"
                :columns="columns"
                :loading="isLoading"
                :items-per-page="10"
                :row-link="row => `/cgp/clients/${row.client_id}`"
                @sort="handleSort"
                @page-change="handlePageChange"
            />
        </div>

        <!-- <client-only> -->
            <!-- <pre>{{ clients }}</pre> -->
        <!-- </client-only> -->

    </div>
</template>