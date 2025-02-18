<template>
    <div class="datatable">
        <div class="bh-table-responsive">
            <table
                class="w-full table-auto"
                :class="{ 'bh-table-hover': true, 'bh-table-striped': false }"
            >
                <thead>
                    <tr>
                        <th
                            v-for="column in columns" :key="column.field"
                            class="border-b border-white-light/40 bg-[#f6f8fa] p-4 text-left dark:border-[#191e3a] dark:bg-[#1a2941]"
                            :class="[column.sortable ? 'cursor-pointer' : '']"
                            :style="column.width ? { width: column.width } : {}"
                            @click="column.sortable ? handleSort(column.field) : null"
                        >
                            <div class="flex items-center font-bold">
                                {{ column.title }}
                                <template v-if="column.sortable">
                                    <span class="bh-sort ml-2 rtl:ml-0 rtl:mr-3">
                                        <svg
                                            v-if="sortState.field === column.field"
                                            class="w-4 h-4"
                                            :class="{ 'rotate-180': sortState.direction === 'desc' }"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5 15l7-7 7 7"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </span>
                                </template>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="loading">
                        <tr>
                            <td :colspan="columns.length" class="p-4 text-center">Chargement...</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr
                            v-for="row in paginatedRows" :key="getRowKey(row)"
                            class="border-b border-white-light/40 dark:border-[#191e3a] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <NuxtLink
                                v-if="rowLink"
                                :to="rowLink(row)"
                                class="contents"
                            >
                                <td
                                    v-for="column in columns"
                                    :key="column.field"
                                    class="p-4 text-black rtl:text-right dark:text-white-dark"
                                >
                                {{ formatCell(row, column) }}
                                </td>
                            </NuxtLink>
                            <template v-else>
                                <td
                                    v-for="column in columns"
                                    :key="column.field"
                                    class="p-4 text-black rtl:text-right dark:text-white-dark"
                                >
                                {{ formatCell(row, column) }}
                                </td>
                            </template>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- <pre>{{ paginatedRows }}</pre> -->

        <Pagination
            v-if="pagination"
            :current-page="currentPage"
            :total-items="rows.length"
            :items-per-page="itemsPerPage"
            :on-page-change="handlePageChange"
        />
    </div>
</template>

<script setup lang="ts">
import type { TableProps, Column, SortState } from "@/types/table";
import Pagination from "./Pagination.vue";

const props = withDefaults(defineProps<TableProps<any>>(), {
    pagination: true,
    itemsPerPage: 10,
    sortable: true,
    loading: false,
});

const currentPage = ref(1);
const sortState = ref<SortState>({ field: "", direction: "asc" });

// Tri des données avec gestion améliorée des types de données
const sortedRows = computed(() => {
    if (!sortState.value.field) return props.rows;

    return [...props.rows].sort((a, b) => {
        const aValue = getNestedValue(a, sortState.value.field);
        const bValue = getNestedValue(b, sortState.value.field);

        // Gestion des valeurs nulles ou undefined
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        if (aValue === bValue) return 0;

        const direction = sortState.value.direction === 'asc' ? 1 : -1;

        // Gestion spécifique selon le type de données
        if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
        }

        return aValue > bValue ? direction : -direction;
    });
});

// Pagination des données
const paginatedRows = computed(() => {
    if (!props.pagination) return sortedRows.value;

    const start = (currentPage.value - 1) * props.itemsPerPage;
    return sortedRows.value.slice(start, start + props.itemsPerPage);
});

const handleSort = (field: string) => {
    if (!props.sortable) return;

    if (sortState.value.field === field) {
        sortState.value.direction =
            sortState.value.direction === "asc" ? "desc" : "asc";
    } else {
        sortState.value = { field, direction: "asc" };
    }

    props.onSort?.(field, sortState.value.direction);
};

const handlePageChange = (page: number) => {
    currentPage.value = page;
    props.onPageChange?.(page);
};

const getRowKey = (row: any) => {
    const uniqueColumn = props.columns.find((col) => col.isUnique);
    return uniqueColumn ? row[uniqueColumn.field] : JSON.stringify(row);
};

const formatCell = (row: any, column: Column) => {
  // Récupère la valeur en utilisant le chemin imbriqué
  const value = getNestedValue(row, column.field);

  // Applique le formateur si défini, en passant à la fois la valeur et la ligne complète
  return column.formatter ? column.formatter(value, row) : value;
};
</script>
