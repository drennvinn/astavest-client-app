<script setup lang="ts">
// import { useAppStore } from '~/stores/useAppStore';


// const store = useAppStore();

definePageMeta({
    middleware: ['auth']
});
</script>

<template>
    <div>

        <h1>DASHBORD CGP ASSO</h1>

        <!-- <div class="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-3">
            <WidgetsTodaysValue />
            <WidgetsTotalDeposit />
            <WidgetsTotalGains />
        </div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <WidgetsPortfolioEvolution />
            <WidgetsRecentTransactions />
        </div> -->
    </div>
</template>