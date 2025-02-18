import { defineStore } from 'pinia'
import type { Theme, Menu, Layout, RtlClass, Animation, Navbar, LanguageItem } from '~/types/app'

export const useAppStore = defineStore('app', {
    state: () => ({
        isDarkMode: false,
        mainLayout: 'app',
        theme: 'light' as Theme,
        menu: 'vertical' as Menu,
        layout: 'full' as Layout,
        rtlClass: 'ltr' as RtlClass,
        animation: 'animate__fadeIn' as Animation,
        navbar: 'navbar-sticky' as Navbar,
        locale: 'en',
        sidebar: false,
        languageList: [
            { code: 'en', name: 'English' },
            { code: 'fr', name: 'French' },
        ] as LanguageItem[],
        isShowMainLoader: true,
        semidark: false,
    }),

    persist: true,

    actions: {
        setMainLayout(payload: 'app' | 'auth' | null = null) {
            this.mainLayout = payload || this.mainLayout
        },

        toggleTheme(payload: Theme | null = null) {
            this.theme = payload || this.theme
            this.isDarkMode = this.theme === 'dark'

            if (this.isDarkMode) {
                document.querySelector('body')?.classList.add('dark')
            } else {
                document.querySelector('body')?.classList.remove('dark')
            }
        },

        toggleMenu(payload: Menu | null = null) {
            this.menu = payload || this.menu
            this.sidebar = false // reset sidebar state
        },

        toggleLayout(payload: Layout | null = null) {
            this.layout = payload || this.layout
        },

        toggleRTL(payload: RtlClass | null = null) {
            this.rtlClass = payload || this.rtlClass
            document.querySelector('html')?.setAttribute('dir', this.rtlClass)
        },

        toggleAnimation(payload: Animation | null = null) {
            this.animation = (payload || this.animation).trim() as Animation
        },

        toggleNavbar(payload: Navbar | null = null) {
            this.navbar = payload || this.navbar
        },

        toggleSemidark(payload: boolean | null = null) {
            this.semidark = payload ?? false
        },

        toggleLocale(payload: string | null = null, setLocale: (locale: string) => void) {
            this.locale = payload || this.locale
            setLocale(this.locale)

            if (this.locale.toLowerCase() === 'ae') {
                this.toggleRTL('rtl')
            } else {
                this.toggleRTL('ltr')
            }
        },

        toggleSidebar() {
            this.sidebar = !this.sidebar
        },

        toggleMainLoader() {
            this.isShowMainLoader = true
            setTimeout(() => {
                this.isShowMainLoader = false
            }, 500)
        },
    },
})