<template>
    <div
        class="main-section relative font-nunito text-sm font-normal antialiased"
        :class="[app_store.sidebar ? 'toggle-sidebar' : '', app_store.menu, app_store.layout]"
    >
        <!--  BEGIN MAIN CONTAINER  -->
        <div class="relative">
            <!-- sidebar menu overlay -->
            <div class="fixed inset-0 z-50 bg-[black]/60 lg:hidden" :class="{ hidden: !app_store.sidebar }" @click="app_store.toggleSidebar()"></div>

            <!-- screen loader -->
            <div
                v-show="app_store.isShowMainLoader"
                class="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#fafafa] dark:bg-[#060818]"
            >
                <img v-if="app_store.theme === 'light'" class="w-[10rem] animate-ping" src="/logo-min-black.png" alt="" />
                <img v-if="app_store.theme === 'dark'" class="w-[10rem] animate-pulse" src="/logo-min-white.png" alt="" />
            </div>

            <div class="fixed bottom-6 z-50 ltr:right-6">
                <template v-if="showTopButton">
                    <button
                        type="button"
                        class="btn btn-outline-primary animate-pulse rounded-full bg-[#fafafa] p-2 dark:bg-[#060818] dark:hover:bg-primary"
                        @click="goToTop"
                    >
                        <svg width="24" height="24" class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                opacity="0.5"
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12 20.75C12.4142 20.75 12.75 20.4142 12.75 20L12.75 10.75L11.25 10.75L11.25 20C11.25 20.4142 11.5858 20.75 12 20.75Z"
                                fill="currentColor"
                            />
                            <path
                                d="M6.00002 10.75C5.69667 10.75 5.4232 10.5673 5.30711 10.287C5.19103 10.0068 5.25519 9.68417 5.46969 9.46967L11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5304 3.46967L18.5304 9.46967C18.7449 9.68417 18.809 10.0068 18.6929 10.287C18.5768 10.5673 18.3034 10.75 18 10.75L6.00002 10.75Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                </template>
            </div>

            <!-- APP SETTING LAUNCHER -->
            <!-- <theme-customizer /> -->

            <div class="main-container min-h-screen text-black dark:text-white-dark" :class="[app_store.navbar]">
                <!-- SIDEBAR  -->
                <ClientLayoutSidebar v-if="auth_store.isClient" />
                <CgpLayoutSidebar v-if="auth_store.isCgpCif" />
                <CgpAssoLayoutSidebar v-if="auth_store.isCgpCifAssociation" />

                <div class="main-content flex flex-col min-h-screen">
                    <!-- TOP NAVBAR  -->
                    <layout-header />

                    <!--  CONTENT AREA  -->
                    <PageTransition>
                        <div class="p-6">
                            <NuxtPage />
                        </div>
                    </PageTransition>

                    <!-- FOOTER -->
                    <!-- <layout-footer /> -->
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import appSetting from '~/app-setting';
    import { useAppStore } from '~/stores/useAppStore';
    import { useAuth } from '~/stores/auth';
    import { useRouter } from 'nuxt/app';

    const router = useRouter();
    const app_store = useAppStore();
    const auth_store = useAuth();
    const showTopButton = ref(false);
    const { setLocale } = useI18n();
    onMounted(() => {
        // set default settings
        appSetting.init(setLocale);

        window.onscroll = () => {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                showTopButton.value = true;
            } else {
                showTopButton.value = false;
            }
        };

        app_store.toggleMainLoader();

        if (app_store.theme === 'dark') {
            document.querySelector('body')?.classList.add('dark')
        }
    });

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
</script>
