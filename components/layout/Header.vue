<template>
    <header class="z-40" :class="{ dark: store.semidark && store.menu === 'horizontal' }">
        <div class="shadow-sm">
            <div class="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-[#0e1726]">
                <div class="horizontal-logo flex items-center justify-between ltr:mr-2 lg:hidden">
                    <NuxtLink to="/" class="main-logo flex shrink-0 items-center">
                        <img v-if="store.theme === 'light'" class="inline w-8 ltr:-ml-1" src="/logo-min-black.png" alt="" />
                        <img v-if="store.theme === 'dark'" class="inline w-8 ltr:-ml-1" src="/logo-min-white.png" alt="" />
                        <span
                            class="hidden align-middle text-2xl font-semibold transition-all duration-300 ltr:ml-1.5 dark:text-white-light md:inline"
                            >STAVEST</span
                        >
                    </NuxtLink>

                    <a
                        href="javascript:;"
                        class="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                        @click="store.toggleSidebar()"
                    >
                        <icon-menu class="h-5 w-5" />
                    </a>
                </div>

                <div class="flex items-center space-x-1.5 ltr:ml-auto dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 lg:space-x-2">
                    <div class="ml-auto">
                        <!-- <a
                            href="javascript:;"
                            v-show="store.theme === 'light'"
                            class="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                            @click="store.toggleTheme('dark')"
                        >
                            <icon-sun />
                        </a>
                        <a
                            href="javascript:;"
                            v-show="store.theme === 'dark'"
                            class="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                            @click="store.toggleTheme('light')"
                        >
                            <icon-moon />
                        </a> -->
                        <button
                            type="button"
                            class="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                            @click="toggleThemeMode"
                        >
                            <icon-sun v-if="store.theme === 'light'" />
                            <icon-moon v-else />
                        </button>
                    </div>

                    <div class="dropdown shrink-0">
                        <client-only>
                            <Popper :placement="'bottom-start'" offsetDistance="8">
                                <button
                                    type="button"
                                    class="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                                >
                                    <img :src="currentFlag" alt="flag" class="h-5 w-5 rounded-full object-cover" />
                                </button>
                                <template #content="{ close }">
                                    <ul
                                        class="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90"
                                        @click="close()"
                                    >
                                        <template v-for="item in store.languageList" :key="item.code">
                                            <li>
                                                <button
                                                    type="button"
                                                    class="w-full hover:text-primary"
                                                    :class="{ 'bg-primary/10 text-primary': store.locale === item?.code }"
                                                    @click="changeLanguage(item)"
                                                >
                                                    <img
                                                        class="h-5 w-5 rounded-full object-cover"
                                                        :src="`/assets/images/flags/${item.code.toUpperCase()}.svg`"
                                                        alt=""
                                                    />
                                                    <span class="ltr:ml-3">{{ item.name }}</span>
                                                </button>
                                            </li>
                                        </template>
                                    </ul>
                                </template>
                            </Popper>
                        </client-only>
                    </div>

                    <div v-if="auth_store.isAuthenticated" class="dropdown shrink-0">
                        <client-only>
                            <Popper :placement="'bottom-start'" offsetDistance="8" class="!block">
                                <button type="button" class="group relative block">
                                    <img
                                        class="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                                        :src="`${runtimeConfig.public.directusUrl}assets/${auth_store.user?.avatar}`"
                                    />
                                </button>
                                <template #content="{ close }">
                                    <ul class="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                        <li>
                                            <div class="flex items-center px-4 py-4">
                                                <div class="flex-none">
                                                    <!-- <img class="h-10 w-10 rounded-md object-cover" src="/assets/images/user-profile.jpeg" alt="" /> -->
                                                    <img :src="`${runtimeConfig.public.directusUrl}assets/${auth_store.user?.avatar}`"
                                                       class="h-10 w-10 rounded-md object-cover"
                                                    />
                                                </div>
                                                <div class="truncate ltr:pl-4">
                                                    <h4 class="text-base">
                                                        {{ auth_store.getFullName }}
                                                    </h4>
                                                    <a class="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                                                        href="javascript:;"
                                                    >{{ auth_store.user?.email }}</a>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <NuxtLink to="/profile" class="dark:hover:text-white" @click="close()">
                                                <icon-user class="h-4.5 w-4.5 shrink-0 ltr:mr-2" />Profile
                                            </NuxtLink>
                                        </li>
                                        <li class="border-t border-white-light dark:border-white-light/10">
                                            <!-- <NuxtLink to="/auth/boxed-signin" class="!py-3 text-danger" @click="close()">
                                                <icon-logout class="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2" />Sign Out
                                            </NuxtLink> -->
                                            <button class="!py-3 text-danger" @click="close(); auth_store.logout()">
                                                <icon-logout class="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2" />Sign Out
                                            </button>
                                        </li>
                                    </ul>
                                </template>
                            </Popper>
                        </client-only>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
    import appSetting from '@/app-setting';
    import { useRoute } from 'vue-router';
    import { useAppStore } from '~/stores/useAppStore';
    import { useAuth } from '~/stores/auth';

    const runtimeConfig = useRuntimeConfig();
    const store = useAppStore();
    const auth_store = useAuth();
    const route = useRoute();
    const search = ref(false);
    const { setLocale } = useI18n();

    // multi language
    const changeLanguage = (item: any) => {
        appSetting.toggleLanguage(item, setLocale);
    };
    const currentFlag = computed(() => {
        return `/assets/images/flags/${store.locale?.toUpperCase()}.svg`;
    });

    const notifications = ref([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ]);

    const messages = ref([
        {
            id: 1,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    onMounted(() => {
        setActiveDropdown();
    });

    watch(route, (to, from) => {
        setActiveDropdown();
    });

    const toggleThemeMode = () => {
        store.toggleTheme(store.theme === 'light' ? 'dark' : 'light')
    }

    const setActiveDropdown = () => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    };

    const removeNotification = (value: number) => {
        notifications.value = notifications.value.filter((d) => d.id !== value);
    };

    const removeMessage = (value: number) => {
        messages.value = messages.value.filter((d) => d.id !== value);
    };
</script>
