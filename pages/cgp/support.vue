<script setup lang="ts">
import { useAuth } from '~/stores/auth';
// import { DirectusUsers } from '~/types';

// const auth_store = useAuth();
// const nuxtApp = useNuxtApp();
// const { $directus } = useNuxtApp();

definePageMeta({
    middleware: ['auth']
});

// const store = ref({});
// onMounted(async () => {
    // store.value = auth_store;
// });
</script>


<template>

    <main>

        <div class="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <SupportGeneralTopics />
            <SupportAdvisor />
        </div>
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <SupportGeneralTopics />
            <SupportHowCanWeHelp />
        </div>


        <!-- <WidgetUserConversations class="messages" /> -->

        <!-- <WidgetAdvisor class="advisor" /> -->

        <!-- <pre>{{ store }}</pre> -->

    </main>

</template>



<style scoped>
.support-container {
    grid-template-areas:
        "messages messages messages advisor"
        ". . . ."
    ;
}
.advisor { grid-area: advisor; }
.messages { grid-area: messages; }

</style>
