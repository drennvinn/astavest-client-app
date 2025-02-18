<!-- pages/login.vue -->
<script setup lang="ts">
import { useAuth } from '~/stores/auth';
import QrcodeVue from 'qrcode.vue';
import { HollowDotsSpinner } from 'epic-spinners';

definePageMeta({
    layout: "login"
});

const router = useRouter();
const authStore = useAuth();
const { t, locale } = useI18n();

// Form inputs
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const gAuthCode = ref('');

// UI states
const error = ref<string | null>(null);
const loading = ref(false);
const isFirstTimeSetup = ref(false);
const showQRCode = ref(false);
const show2FAInput = ref(false);

// 2FA data
const qrCodeImg = ref('');
const qrCodeSecret = ref('');

const handle2FASetup = async () => {
    try {
        const { secret, otpauth_url } = await authStore.setupTwoFactor(password.value);
        qrCodeSecret.value = secret;
        qrCodeImg.value = otpauth_url;
        showQRCode.value = true;
        show2FAInput.value = true;
    } catch (e: any) {
        error.value = e.message || "Erreur lors de la configuration 2FA";
        loading.value = false;
    }
};

const validateAndSubmit2FA = async () => {
    try {
        if (isFirstTimeSetup.value) {
            await authStore.setupTwoFactor(password.value, gAuthCode.value);
            router.push(`/${authStore.getUserRole}`);
            return;
        }

        const result = await authStore.login({
            email: email.value,
            password: password.value,
            otp: gAuthCode.value
        });

        if (result.requires2FA) {
            throw new Error("Code invalide");
        }

        if (result.success) {
            router.push(`/${authStore.getUserRole}`);
        }
    } catch (e: any) {
        throw new Error(e.message || "Code invalide");
    }
};

const login = async () => {
    if (loading.value) return;

    error.value = null;
    loading.value = true;

    try {
        // Validation du code 2FA si déjà affiché
        if (show2FAInput.value) {
            if (!gAuthCode.value || gAuthCode.value.length !== 6) {
                throw new Error('Veuillez entrer un code à 6 chiffres');
            }
            await validateAndSubmit2FA();
            return;
        }

        // Configuration initiale
        authStore.setRememberMe(rememberMe.value);
        const response = await authStore.login({
            email: email.value,
            password: password.value
        });

        // Si c'est une première connexion
        if (authStore.isFirstTimeSetup) {
            isFirstTimeSetup.value = true;
            await handle2FASetup();
            return;
        }

        // Gestion de la 2FA
        if (response.requires2FA) {
            show2FAInput.value = true;
            return;
        }

        router.push(`/${authStore.getUserRole}`);
    } catch (e: any) {
        error.value = e.message || 'Une erreur est survenue';
    } finally {
        loading.value = false;
    }
};

// Nettoyage des données sensibles
onBeforeUnmount(() => {
    password.value = '';
    gAuthCode.value = '';
    qrCodeSecret.value = '';
});

// Protection contre le retour sur la page de connexion
onMounted(() => {
    if (authStore.isAuthenticated) {
        router.push(`/${authStore.getUserRole}`);
        return;
    }
    authStore.$reset();
});

// Reset de l'erreur lors de la saisie
watch([email, password, gAuthCode], () => {
    error.value = null;
});
</script>

<template>
    <main class="relative">
        <div v-if="loading" class="absolute h-full w-full">
            <div class="bg-white h-full w-full rounded-xl opacity-60 z-10"></div>
            <hollow-dots-spinner
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                :animation-duration="1000"
                :dot-size="15"
                :dots-num="3"
                color="#F5A333"
            />
        </div>

        <div class="flex flex-col items-center justify-center w-[24rem] h-full p-4 bg-white rounded-xl shadow-xl">
            <form @submit.prevent="login" class="w-full max-w-[22rem]">
                <h1 v-if="locale === 'fr'" class="text-4xl font-semibold mb-4">Connexion</h1>
                <h1 v-else class="text-4xl font-semibold mb-4">Login</h1>

                <!-- Formulaire initial (email + password) -->
                <template v-if="!show2FAInput">
                    <p v-if="locale === 'fr'" class="text-gray-500 mb-4">Connectez vous à votre compte</p>
                    <p v-else class="text-gray-500 mb-4">Connect to your account</p>

                    <div class="mb-4">
                        <label for="email" class="block mb-2">Email</label>
                        <input
                            v-model="email"
                            type="email"
                            id="email"
                            required
                            class="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block mb-2">Mot de passe</label>
                        <input
                            v-model="password"
                            type="password"
                            id="password"
                            required
                            class="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div class="mb-4">
                        <label for="remember" class="inline-flex items-center select-none">
                            <input v-model="rememberMe" type="checkbox" id="remember" class="mr-2" />Se souvenir de moi
                        </label>
                    </div>
                </template>

                <!-- QR Code et input 2FA (première connexion) -->
                <template v-if="showQRCode">
                    <p v-if="locale === 'fr'" class="text-gray-500 mb-4">Chez Astavest, votre sécurité est notre priorité. Conformément aux réglementations, toutes les connexions aux comptes nécessitent une authentification à deux facteurs (2FA).</p>
                    <p v-else class="text-gray-500 mb-4">At Astavest, your security is our priority. In compliance with regulations, all account connections require two-factor authentication (2FA)</p>
                    <p v-if="locale === 'fr'" class="text-gray-500 mb-4">Veuillez scanner le QRcode ci-dessous dans votre application Google Authenticator</p>
                    <p v-else class="text-gray-500 mb-4">Please scan the QR code below in your Google Authenticator app</p>
                    <qrcode-vue
                        v-if="qrCodeImg"
                        :value="qrCodeImg"
                        :size="200"
                        level="H"
                        class="mx-auto mb-4"
                    />
                </template>

                <!-- Input 2FA (toutes les connexions nécessitant 2FA) -->
                <template v-if="show2FAInput">
                    <p v-if="!showQRCode" class="text-2xl text-gray-500 mb-2">
                        Vos identifiants sont valides!
                    </p>
                    <p v-if="!showQRCode" class="mb-8">
                        À présent, veuillez fournir le code de vérification se trouvant sur votre application Google Authenticator:
                    </p>
                    <div class="mb-4">
                        <label for="code" class="block mb-2">Code secret</label>
                        <UtilsSecretCode v-model="gAuthCode" />
                    </div>
                </template>

                <div v-if="error" class="mb-4 text-red-500 text-sm">
                    {{ error }}
                </div>

                <div class="mb-4">
                    <button
                        type="submit"
                        class="w-full p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Confirmer
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>