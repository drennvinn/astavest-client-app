//middleware/auth.ts
import { useAuth } from '~/stores/auth';

const PUBLIC_ROUTES = ['/login'] as const;
const ROUTES_BY_ROLES = {
    client: [
        '/client', '/client/profile', '/client/support'
    ],
    cgp: [
        '/cgp', '/cgp/profile', '/cgp/support', '/cgp/clients', '/cgp/clients/:id'
    ],
    cgp_asso: [
        '/cgp-asso', '/cgp-asso/profile', '/cgp-asso/support'
    ],
} as const;

export default defineNuxtRouteMiddleware(async (to, from) => {
    // return;
    const auth = useAuth();
    const { $directus, $readMe } = useNuxtApp();

    // Si la route est publique, on laisse passer
    if (PUBLIC_ROUTES.includes(to.path as typeof PUBLIC_ROUTES[number])) {
        return;
    }

    try {
        // Tentative de restauration de session
        if (auth.authStep !== 'authenticated') {
            await $directus.refresh();
            // Vérifier si la session est vraiment complète (avec 2FA)
            const user = await $directus.request($readMe({ fields: ['*', { role: ['slug'] }] }));
            if (user.tfa_secret) {
                auth.setUser(user);
                auth.authStep = 'authenticated';
            } else {
                // Session incomplète ou en cours de configuration 2FA
                return navigateTo('/login');
            }
        }

        // Vérification des permissions de route basées sur le rôle
        const userRole = auth.getUserRole as keyof typeof ROUTES_BY_ROLES;
        if (userRole) {
            if (to.path === '/') {
                return navigateTo(ROUTES_BY_ROLES[userRole][0]);
            }

            // Vérifier si la route demandée est autorisée pour ce rôle
            const allowedRoutes = ROUTES_BY_ROLES[userRole];
            const isRouteAllowed = allowedRoutes.some(route =>
                to.path.startsWith(route)
            );

            if (!isRouteAllowed) {
                // Redirection vers le dashboard approprié si la route n'est pas autorisée
                return navigateTo(ROUTES_BY_ROLES[userRole][0]);
            }
        }
    } catch (error) {
        // Si la session n'est pas valide ou incomplète, redirection vers login
        return navigateTo('/login');
    }

    // Protection des routes pendant la configuration 2FA
    if (auth.authStep === 'credentials_validated') {
        return navigateTo('/login');
    }

    // Si pas authentifié complètement, redirection vers login
    if (!auth.isAuthenticated) {
        return navigateTo('/login');
    }
});