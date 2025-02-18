<template>
    <div :class="{ 'dark text-white-dark': store.semidark }">
        <nav class="sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300">
            <div class="h-full bg-white dark:bg-[#0e1726]">
                <div class="flex items-center justify-between px-4 py-3 mb-8">
                    <NuxtLink to="/" class="main-logo flex shrink-0 items-center">
                        <img v-if="store.theme === 'light' && !store.semidark" src="/logo_black.png" alt="" class="ml-[5px] w-48 flex-none">
                        <img v-if="store.theme === 'dark' || store.semidark" src="/logo_white.png" alt="" class="ml-[5px] w-48 flex-none">
                    </NuxtLink>
                    <a
                        href="javascript:;"
                        class="collapse-icon flex h-8 w-8 ml-4 items-center rounded-full transition duration-300 hover:bg-gray-500/10 hover:text-primary rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                        @click="store.toggleSidebar()"
                    >
                        <icon-carets-down class="m-auto rotate-90" />
                    </a>
                </div>
                <client-only>
                    <perfect-scrollbar
                        :options="{
                            swipeEasing: true,
                            wheelPropagation: false,
                        }"
                        class="relative h-[calc(100vh-80px)]"
                    >
                        <ul class="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li class="nav-item">
                                <ul class="text-lg">
                                    <li class="nav-item">
                                        <NuxtLink to="/profile" class="group" @click="toggleMobileMenu">
                                            <div class="flex items-center">
                                                <icon-menu-users class="shrink-0 group-hover:!text-primary" />
                                                <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{{
                                                    $t('profile')
                                                }}</span>
                                            </div>
                                        </NuxtLink>
                                    </li>
                                    <!-- <li class="nav-item">
                                        <NuxtLink to="/support" class="group" @click="toggleMobileMenu">
                                            <div class="flex items-center">
                                                <icon-menu-chat class="shrink-0 group-hover:!text-primary" />

                                                <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{{
                                                    $t('support')
                                                }}</span>
                                            </div>
                                        </NuxtLink>
                                    </li> -->
                                </ul>
                            </li>
                        </ul>
                    </perfect-scrollbar>
                </client-only>
            </div>
        </nav>
    </div>
</template>

<script lang="ts" setup>
    import { useAppStore } from '~/stores/useAppStore';
    // import VueCollapsible from 'vue-height-collapsible/vue3';
    const store = useAppStore();
    const activeDropdown: any = ref('');
    const subActive: any = ref('');

    onMounted(() => {
        setTimeout(() => {
            const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');

            if (selector) {
                selector.classList.add('active');
                const ul: any = selector.closest('ul.sub-menu');
                if (ul) {
                    let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];

                    if (ele.length) {
                        ele = ele[0];
                        setTimeout(() => {
                            ele.click();
                        });
                    }
                }
            }
        });
    });

    const toggleMobileMenu = () => {
        if (window.innerWidth < 1024) {
            store.toggleSidebar();
        }
    };
</script>
