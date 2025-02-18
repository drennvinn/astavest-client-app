<script setup lang="ts">
const store = useAppStore();

const areaChart = computed(() => {
    const isDark = store.theme === 'dark' || store.isDarkMode ? true : false;
    const isRtl = store.rtlClass === 'rtl' ? true : false;
    return {
        chart: {
            type: 'area',
            height: 300,
            zoom: { enabled: false, },
            toolbar: { show: false, },
        },
        colors: ['#805dca'],
        dataLabels: { enabled: false, },
        stroke: {
            width: 2,
            curve: 'smooth',
        },
        xaxis: {
            axisBorder: {
                color: isDark ? '#191e3a' : '#e0e6ed',
            },
        },
        yaxis: {
            opposite: isRtl ? true : false,
            labels: {
                offsetX: isRtl ? -40 : 0,
            },
        },
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        legend: { horizontalAlign: 'left', },
        grid: { borderColor: isDark ? '#191e3a' : '#e0e6ed', },
        tooltip: { theme: isDark ? 'dark' : 'light', },
    };
});

const areaChartSeries = ref([
    {
        name: 'Income',
        data: [12000, 16800, 23800, 17800, 15800, 21342, 19000, 28900, 25200, 34000, 41230, 52840],
    },
]);
</script>


<template>
    <div class="panel">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white">Portfolio evolution</h5>
        </div>
        <div class="mb-5">
            <client-only>
                <apexchart
                    height="300"
                    :options="areaChart"
                    :series="areaChartSeries"
                    class="overflow-hidden rounded-lg bg-white dark:bg-black"
                ></apexchart>
            </client-only>
        </div>
    </div>
</template>