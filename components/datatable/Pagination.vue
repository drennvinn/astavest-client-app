<template>
    <div class="bh-pagination flex items-center justify-between p-4">
        <div class="bh-pagination-info flex items-center">
            <span class="text-sm">
                Affichage {{ startIndex + 1 }}-{{ endIndex }} sur
                {{ totalItems }}
            </span>
        </div>
        <div class="bh-pagination-number flex items-center space-x-2">
            <button
                @click="onPageChange(currentPage - 1)"
                :disabled="currentPage === 1"
                class="bh-page-item flex h-9 w-9 items-center justify-center rounded-full"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4.5 h-4.5 rtl:rotate-180"
                >
                    <path
                        d="M15 5L9 12L15 19"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
            <span class="px-3 py-1">{{ currentPage }}/{{ totalPages }}</span>
            <button
                @click="onPageChange(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="bh-page-item flex h-9 w-9 items-center justify-center rounded-full"
                :class="{
                    'opacity-50 cursor-not-allowed': currentPage === totalPages,
                }"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4.5 h-4.5 rtl:rotate-180"
                >
                    <path
                        d="M9 5L15 12L9 19"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const props = defineProps<PaginationProps>();

const totalPages = computed(() =>
    Math.ceil(props.totalItems / props.itemsPerPage)
);
const startIndex = computed(() => (props.currentPage - 1) * props.itemsPerPage);
const endIndex = computed(() =>
    Math.min(startIndex.value + props.itemsPerPage, props.totalItems)
);
</script>
