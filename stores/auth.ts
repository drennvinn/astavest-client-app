// store/auth.ts
import { defineStore } from "pinia";
import type { AuthResponse, AuthState, DirectusErrorResponse, UserRole } from "../types/auth";
import { AuthErrorCode } from "../types/auth";
// import type { DirectusUser } from "@directus/sdk";
import type {
    DirectusUsers,
    DirectusRoles,
    Clients,
    CgpCif,
    CgpCifAssociation
} from "../types/astavest-crm";


export const useAuth = defineStore("auth", {

    persist: true,

    state: (): AuthState => ({
        user: null,
        userRole: null,
        userProfile: null,
        rememberMe: false,
        tfaRequired: false,
        isFirstTimeSetup: false,
        tfaSecret: null,
        tfaPending: false,
        authStep: 'initial',
        tempCredentials: null,
    }),

    getters: {
        getCurrentUser: (state) => state.authStep === 'authenticated' ? state.user : null,
        getFullName: (state) => state.authStep === 'authenticated' ? state.user?.first_name + ' ' + state.user?.last_name : null,

        isAuthenticated: (state) => state.authStep === 'authenticated' && !!state.user,
        getTfaRequired: (state) => state.tfaRequired,
        isAwaitingTfaSetup: (state) => state.authStep === 'credentials_validated' && state.isFirstTimeSetup,
        isAwaitingTfaValidation: (state) => state.authStep === 'credentials_validated' && !state.isFirstTimeSetup,

        getUserRole: (state) => state.userRole,
        isClient: (state) => state.userRole === 'client',
        isCgpCif: (state) => state.userRole === 'cgp',
        isCgpCifAssociation: (state) => state.userRole === 'cgp_asso',
        getUserProfile: (state) => state.userProfile,
    },

    actions: {
        async login({ email, password, otp }: { email: string; password: string; otp?: string; }) {
            const { $directus, $readMe } = useNuxtApp();

            try {
                await $directus.login(email, password, { otp, mode: 'cookie' }) as AuthResponse;
                const user = await $directus.request($readMe({
                    fields: ['*', { role: ['slug'] }]
                })) as DirectusUsers;

                if (!otp) {
                    // Première étape : stockage temporaire
                    this.tempCredentials = { email, password };
                    this.isFirstTimeSetup = !user.tfa_secret;
                    this.authStep = 'credentials_validated';

                    // Si c'est une première connexion (pas de secret 2FA)
                    if (!user.tfa_secret) {
                        return { isFirstTimeSetup: true };
                    }
                    return { requires2FA: true };
                }

                // Validation complète avec 2FA
                this.setUser(user);
                this.authStep = 'authenticated';
                this.tempCredentials = null;
                return { success: true };
            } catch (e: any) {
                const { errors } = e as DirectusErrorResponse;
                const error = errors?.[0];

                if (!error) { throw new Error('Une erreur inconnue est survenue'); }

                switch (error.extensions.code) {
                    case AuthErrorCode.InvalidCredentials:
                        throw new Error('Identifiants invalides');
                    case AuthErrorCode.InvalidPayload:
                        throw new Error('Requête invalide');
                    case AuthErrorCode.InvalidOtp:
                        this.tfaRequired = true;
                        return { requires2FA: true };
                    default:
                        throw new Error(error.message || 'Une erreur est survenue');
                }
            }
        },


        async setupTwoFactor(password: string, otp?: string) {
            const { $directus, $enableTwoFactor, $generateTwoFactorSecret, $readMe } = useNuxtApp();

            try {
                if (!this.tfaSecret && !otp) {
                    // Génération du secret 2FA avec le mot de passe requis
                    const { secret, otpauth_url } = await $directus.request(
                        $generateTwoFactorSecret(password)
                    );
                    this.tfaSecret = secret;
                    this.tfaPending = true;
                    return { secret, otpauth_url, success: false };
                }

                if (this.tfaSecret && otp) {
                    await $directus.request($enableTwoFactor(this.tfaSecret, otp)); // Activation de la 2FA avec le code OTP
                    const user = await $directus.request($readMe({
                        fields: ['*', { role: ['slug'] }]
                    })) as DirectusUsers; // Mise à jour des données utilisateur
                    this.setUser(user);
                    this.authStep = 'authenticated';
                    this.tfaSecret = null; // Nettoyage du secret temporaire
                    return { success: true };
                }

                throw new Error('Données manquantes pour la configuration 2FA');
            } catch (e: any) {
                const { errors } = e as DirectusErrorResponse;
                const error = errors?.[0];

                if (error?.extensions.code === AuthErrorCode.InvalidPayload) {
                    throw new Error('Code OTP invalide');
                }
                this.$reset();
                throw new Error(error?.message || 'Une erreur est survenue lors de la configuration 2FA');
            }
        },



        async setUser(user: DirectusUsers) {
            this.user = user;
            this.isFirstTimeSetup = !user.tfa_secret;
            // this.userRole = (typeof user.role === 'string' ? user.role : user.role?.slug) as UserRole;
            this.userRole = user.role?.slug as DirectusRoles['slug'];

            if (!this.userRole) {
                throw new Error('Rôle utilisateur non défini');
            }

            const { $directus, $readItems } = useNuxtApp();
            try {
                switch (this.userRole) {
                    case 'client':
                        const clientReq = await $directus.request(
                            $readItems('clients', { filter: { user: user.id } })
                        );
                        this.userProfile = clientReq[0];
                        break;
                    case 'cgp':
                        const cgpReq = await $directus.request(
                            $readItems('cgp_cif', { filter: { user: user.id } })
                        );
                        this.userProfile = cgpReq[0];
                        break;
                    case 'cgp-asso':
                        const cgpAssoReq = await $directus.request(
                            $readItems('cgp_cif_association', { filter: { user: user.id } })
                        );
                        this.userProfile = cgpAssoReq[0];
                        break;
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du profil:', error);
            }
        },



        async logout() {
            const { $directus } = useNuxtApp();
            const router = useRouter();
            try {
                await $directus.logout();
                router.push('/login');
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            } finally {
                this.$reset();
            }
        },


        setRememberMe(value: boolean) {
            this.rememberMe = value;
        },
    },
});