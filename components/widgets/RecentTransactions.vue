<script setup lang="ts">
</script>

<template>
    <div class="panel">
        <div class="mb-5 text-lg font-bold">Recent Transactions</div>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th class="ltr:rounded-l-md rtl:rounded-r-md">ID</th>
                        <th>DATE</th>
                        <th>AMOUNT</th>
                        <th class="text-center ltr:rounded-r-md rtl:rounded-l-md">STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="font-semibold">#185645</td>
                        <td class="whitespace-nowrap">Oct 08, 2023</td>
                        <td>$1,358.75</td>
                        <td class="text-center">
                            <span class="badge rounded-full bg-success/20 text-success hover:top-0">Completed</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">#954723</td>
                        <td class="whitespace-nowrap">Dec 18, 2023</td>
                        <td>-$1,042.82</td>
                        <td class="text-center">
                            <span class="badge rounded-full bg-info/20 text-info hover:top-0">In Process</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">#423795</td>
                        <td class="whitespace-nowrap">Dec 25, 2023</td>
                        <td>$1,828.16</td>
                        <td class="text-center">
                            <span class="badge rounded-full bg-danger/20 text-danger hover:top-0">Pending</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">#437945</td>
                        <td class="whitespace-nowrap">Nov 29, 2024</td>
                        <td>$1,647.55</td>
                        <td class="text-center">
                            <span class="badge rounded-full bg-success/20 text-success hover:top-0">Completed</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">#564721</td>
                        <td class="whitespace-nowrap">Nov 24, 2024</td>
                        <td>$927.43</td>
                        <td class="text-center">
                            <span class="badge rounded-full bg-success/20 text-success hover:top-0">Completed</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="font-semibold">#348751</td>
                        <td class="whitespace-nowrap">Jan 26, 2025</td>
                        <td>$250.00</td>
                        <td class="text-center">
                            <span class="badge rounded-full bg-info/20 text-info hover:top-0">In Process</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>