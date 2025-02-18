// plugins/directus.ts
import {
    createDirectus,
    authentication,
    rest,
    generateTwoFactorSecret, enableTwoFactor,
    createItem, createItems,
    readItem, readItems,
    readFiles, uploadFiles, updateFiles,
    createNotification, createNotifications,
    readMe,
    realtime
} from '@directus/sdk';
import type { CustomDirectusTypes } from '../types/astavest-crm';
import { useAuth } from '~/stores/auth'


export default defineNuxtPlugin(async (nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const directusUrl = runtimeConfig.public.directusUrl;
    const auth_store = useAuth();

    const directus = createDirectus<CustomDirectusTypes>(directusUrl)
        .with(authentication('cookie', {
            credentials: 'include', // Important pour les cookies cross-domain
            autoRefresh: auth_store.rememberMe,
            msRefreshBeforeExpires: 30000, // rafraîchir le token 30s avant expiration
        }))

        .with(rest({
            credentials: 'include', // Nécessaire pour envoyer les cookies avec les requêtes
            // onResponse: async (response) => {
            //     if (!response.ok && (response.status === 401 || response.status === 403) &&
            //         window.location.pathname !== '/login') {
            //         await auth_store.logout();
            //         navigateTo('/login');
            //     }
            //     return response;
            // },
        }))

    return {
        provide: {
            directus,
            generateTwoFactorSecret, enableTwoFactor,
            readItem, readItems,
            createItem, createItems,
            readFiles, uploadFiles, updateFiles,
            createNotification, createNotifications,
            readMe
        },
    };

})
