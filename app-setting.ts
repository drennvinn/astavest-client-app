import { $themeConfig } from './theme.config';
import { useAppStore } from '~/stores/useAppStore';
import type { LanguageItem } from '~/types/app';

export default {
    init(setLocale: (locale: string) => void) {
        const store = useAppStore()

        // Initialiser avec les valeurs par défaut si nécessaire
        // if (store.theme !== $themeConfig.theme) store.toggleTheme($themeConfig.theme)
        // if (store.menu !== $themeConfig.menu) store.toggleMenu($themeConfig.menu)
        // if (store.layout !== $themeConfig.layout) store.toggleLayout($themeConfig.layout)
        // if (store.rtlClass !== $themeConfig.rtlClass) store.toggleRTL($themeConfig.rtlClass)
        // if (store.animation !== $themeConfig.animation) store.toggleAnimation($themeConfig.animation)
        // if (store.navbar !== $themeConfig.navbar) store.toggleNavbar($themeConfig.navbar)
        // if (store.semidark !== $themeConfig.semidark) store.toggleSemidark($themeConfig.semidark)

        // Gestion de la langue
        const currentLocale = store.locale || $themeConfig.locale
        const languageItem = store.languageList.find(item => item.code === currentLocale)
        if (languageItem) {
            this.toggleLanguage(languageItem, setLocale)
        }
    },

    toggleLanguage(item: LanguageItem | null, setLocale: (locale: string) => void) {
        const store = useAppStore()

        let selectedItem = item

        if (!selectedItem) {
            // Utilisation d'une variable intermédiaire pour gérer le typage
            const foundItem = store.languageList.find(d => d.code === store.locale) ||
                store.languageList.find(d => d.code === 'en')

            if (foundItem) {
                selectedItem = foundItem
            }
        }

        if (selectedItem) {
            store.toggleLocale(selectedItem.code, setLocale)
        }

        return selectedItem
    }
}