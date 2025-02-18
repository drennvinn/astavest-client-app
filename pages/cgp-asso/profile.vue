<template>
    <div>
        <!-- BREADCRUMB -->
        <!-- <ul class="flex space-x-2 rtl:space-x-reverse">
            <li>
                <a href="javascript:;" class="text-primary hover:underline">Users</a>
            </li>
            <li class="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                <span>Profile</span>
            </li>
        </ul> -->
        <div class="pt-5">
            <div class="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">

                <!-- PROFILE CARD -->
                <div class="panel">
                    <div class="mb-5 flex items-center justify-between">
                        <h5 class="text-lg font-semibold dark:text-white-light">Profile</h5>
                    </div>
                    <div class="mb-5">
                        <div class="flex flex-col items-center justify-center">
                            <img :src="`${runtimeConfig.public.directusUrl}assets/${client?.user?.avatar}`" class="mb-5 h-28 w-28 rounded-full object-cover" />
                            <p class="text-xl font-semibold text-primary">{{ auth_store.getFullName }}</p>
                        </div>
                        <ul class="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                            <li class="flex items-center gap-2">
                                <icon-calendar class="shrink-0" />
                                {{ client?.date_of_birth }}
                            </li>
                            <li class="flex items-center gap-2">
                                <icon-map-pin class="shrink-0" />
                                {{ client?.city }} {{ client?.zipcode }}
                            </li>
                            <li>
                                <a href="javascript:;" class="flex items-center gap-2">
                                    <icon-mail class="w-5 h-5 shrink-0" />
                                    <span class="truncate text-primary">{{ client?.user?.email }}</span></a
                                >
                            </li>
                            <li class="flex items-center gap-2">
                                <icon-phone />
                                <span class="whitespace-nowrap" dir="ltr">{{ client?.phone }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- END PROFILE CARD -->


                <!-- REQUEST FOR CHANGE USER INFORMATION -->
                <div class="panel lg:col-span-2 xl:col-span-3">
                    <div class="mb-5">
                        <h5 class="text-lg font-semibold dark:text-white-light">Request for change user information</h5>
                    </div>
                    <div class="mb-5">
                        <Form
                            :initial-data="formData"
                            :rules="validationRules"
                            @submit="onSubmit"
                            customSubmitBtn
                            class="max-w-screen-sm mx-auto"
                        >
                            <template v-slot="{ getFieldError, touchField }">
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FormInput
                                        label="Nom"
                                        name="user.last_name"
                                        type="text"
                                        v-model="formData.user.last_name"
                                        :error="getFieldError('user.last_name')"
                                        @blur="touchField('user.last_name')"
                                    />
                                    <FormInput
                                        label="Prénom"
                                        name="user.first_name"
                                        type="text"
                                        v-model="formData.user.first_name"
                                        :error="getFieldError('user.first_name')"
                                        @blur="touchField('user.first_name')"
                                    />
                                </div>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FormInput
                                        label="Email"
                                        name="user.email"
                                        type="email"
                                        v-model="formData.user.email"
                                        :error="getFieldError('user.email')"
                                        @blur="touchField('user.email')"
                                    />
                                    <FormInput
                                        label="Phone"
                                        name="phone"
                                        type="tel"
                                        v-model="formData.phone"
                                        :error="getFieldError('phone')"
                                        @blur="touchField('phone')"
                                    />
                                </div>
                                <button type="submit" class="btn btn-primary !mt-6">Submit my request</button>
                            </template>

                        </Form>
                        <!-- <form class="space-y-5">
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label for="gridEmail">Email</label>
                                    <input id="gridEmail" type="email" placeholder="Enter Email" class="form-input" />
                                </div>
                                <div>
                                    <label for="gridPassword">Password</label>
                                    <input id="gridPassword" type="Password" placeholder="Enter Password" class="form-input" />
                                </div>
                            </div>
                            <div>
                                <label for="gridAddress1">Address</label>
                                <input id="gridAddress1" type="text" placeholder="Enter Address" value="1234 Main St" class="form-input" />
                            </div>
                            <div>
                                <label for="gridAddress2">Address2</label>
                                <input id="gridAddress2" type="text" placeholder="Enter Address2" value="Apartment, studio, or floor" class="form-input" />
                            </div>
                            <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                <div class="md:col-span-2">
                                    <label for="gridCity">City</label>
                                    <input id="gridCity" type="text" placeholder="Enter City" class="form-input" />
                                </div>
                                <div>
                                    <label for="gridState">State</label>
                                    <select id="gridState" class="form-select text-white-dark">
                                        <option>Choose...</option>
                                        <option>...</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="gridZip">Zip</label>
                                    <input id="gridZip" type="text" placeholder="Enter Zip" class="form-input" />
                                </div>
                            </div>
                            <div>
                                <label class="mt-1 flex cursor-pointer items-center">
                                    <input type="checkbox" class="form-checkbox" />
                                    <span class="text-white-dark">Check me out</span>
                                </label>
                            </div>
                            <button type="submit" class="btn btn-primary !mt-6">Submit my request</button>
                        </form> -->
                    </div>
                </div>
                <!-- END REQUEST FOR CHANGE USER INFORMATION -->

            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div class="panel">
                    <h1 class="text-2xl font-semibold dark:text-white-light text-center">Documents règlementaires</h1>
                    <p class="text-center">Pas de documents pour le moment</p>
                </div>
                <div class="panel">
                    <h1 class="text-2xl font-semibold dark:text-white-light text-center">Connaissance client</h1>
                    <p>...</p>
                </div>
            </div>


            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">

                <!-- HISTORY OF THE STAGES -->
                <div class="panel">
                    <div class="mb-5 flex items-center justify-between">
                        <h5 class="text-lg font-semibold dark:text-white-light">History of the stages</h5>
                    </div>
                    <div>
                        <div class="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                            <div class="flex items-center justify-between py-2">
                                <h6 class="font-semibold text-[#515365] dark:text-white-dark">
                                    March<span class="block text-white-dark dark:text-white-light">Pro Membership</span>
                                </h6>
                                <div class="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                    <p class="font-semibold">90%</p>
                                    <div class="dropdown ltr:ml-4 rtl:mr-4">
                                        <client-only>
                                            <Popper
                                                :placement="'bottom-end'"
                                                offsetDistance="0"
                                                class="align-middle"
                                            >
                                                <a href="javascript:;">
                                                    <icon-horizontal-dots class="opacity-80 hover:opacity-100" />
                                                </a>
                                                <template #content="{ close }">
                                                    <ul @click="close()" class="whitespace-nowrap">
                                                        <li><a href="javascript:;">View Invoice</a></li>
                                                        <li><a href="javascript:;">Download Invoice</a></li>
                                                    </ul>
                                                </template>
                                            </Popper>
                                        </client-only>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                            <div class="flex items-center justify-between py-2">
                                <h6 class="font-semibold text-[#515365] dark:text-white-dark">
                                    February <span class="block text-white-dark dark:text-white-light">Pro Membership</span>
                                </h6>
                                <div class="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                    <p class="font-semibold">90%</p>
                                    <div class="dropdown ltr:ml-4 rtl:mr-4">
                                        <client-only>
                                            <Popper
                                                :placement="'bottom-end'"
                                                offsetDistance="0"
                                                class="align-middle"
                                            >
                                                <a href="javascript:;">
                                                    <icon-horizontal-dots class="opacity-80 hover:opacity-100" />
                                                </a>
                                                <template #content="{ close }">
                                                    <ul @click="close()" class="whitespace-nowrap">
                                                        <li>
                                                            <a href="javascript:;">View Invoice</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:;">Download Invoice</a>
                                                        </li>
                                                    </ul>
                                                </template>
                                            </Popper>
                                        </client-only>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="flex items-center justify-between py-2">
                                <h6 class="font-semibold text-[#515365] dark:text-white-dark">
                                    January<span class="block text-white-dark dark:text-white-light">Pro Membership</span>
                                </h6>
                                <div class="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                    <p class="font-semibold">90%</p>
                                    <div class="dropdown ltr:ml-4 rtl:mr-4">
                                        <client-only>
                                            <Popper
                                                :placement="'bottom-end'"
                                                offsetDistance="0"
                                                class="align-middle"
                                            >
                                                <a href="javascript:;">
                                                    <icon-horizontal-dots class="opacity-80 hover:opacity-100" />
                                                </a>
                                                <template #content="{ close }">
                                                    <ul @click="close()" class="whitespace-nowrap">
                                                        <li>
                                                            <a href="javascript:;">View Invoice</a>
                                                        </li>
                                                        <li>
                                                            <a href="javascript:;">Download Invoice</a>
                                                        </li>
                                                    </ul>
                                                </template>
                                            </Popper>
                                        </client-only>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END HISTORY OF THE STAGES -->


                <!-- DEPOSIT HISTORY -->
                <div class="panel">
                    <div class="mb-5 flex items-center justify-between">
                        <h5 class="text-lg font-semibold dark:text-white-light">Deposit history</h5>
                    </div>
                    <div>
                        <div class="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                            <div class="flex items-center justify-between py-2">
                                <div class="flex-none">
                                    <img src="/assets/images/card-americanexpress.svg" alt="" />
                                </div>
                                <div class="flex flex-auto items-center justify-between ltr:ml-4 rtl:mr-4">
                                    <h6 class="font-semibold text-[#515365] dark:text-white-dark">
                                        American Express <span class="block text-white-dark dark:text-white-light">Expires on 12/2025</span>
                                    </h6>
                                    <span class="badge bg-success ml-auto">500€</span>
                                </div>
                            </div>
                        </div>
                        <div class="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                            <div class="flex items-center justify-between py-2">
                                <div class="flex-none">
                                    <img src="/assets/images/card-mastercard.svg" alt="" />
                                </div>
                                <div class="flex flex-auto items-center justify-between ltr:ml-4 rtl:mr-4">
                                    <h6 class="font-semibold text-[#515365] dark:text-white-dark">
                                        Mastercard <span class="block text-white-dark dark:text-white-light">Expires on 03/2025</span>
                                    </h6>
                                    <span class="badge bg-success ml-auto">500€</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="flex items-center justify-between py-2">
                                <div class="flex-none">
                                    <img src="/assets/images/card-visa.svg" alt="" />
                                </div>
                                <div class="flex flex-auto items-center justify-between ltr:ml-4 rtl:mr-4">
                                    <h6 class="font-semibold text-[#515365] dark:text-white-dark">
                                        Visa <span class="block text-white-dark dark:text-white-light">Expires on 10/2025</span>
                                    </h6>
                                    <span class="badge bg-success ml-auto">500€</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END DEPOSIT HISTORY -->

            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '~/stores/useAppStore';
import { useAuth } from '~/stores/auth';
import type { Clients } from '~/types/astavest-crm';



useHead({ title: 'User Profile' });

definePageMeta({
    middleware: ['auth']
});

const store = useAppStore();
const auth_store = useAuth();
const runtimeConfig = useRuntimeConfig();
const client = ref<Clients>();
const isLoading = ref(true);
const error = ref<string | null>(null);

const {
    $directus,
    $readItems,
    // $readFiles
} = useNuxtApp();


const formData = ref({
    phone: '',
    street: '',
    city: '',
    zipcode: '',
    country: '',
    user: {
        first_name: '',
        last_name: '',
        email: '',
    }
});

watch(() => client.value, (newClient) => {
    if (newClient) {
        formData.value = {
            phone: newClient.phone || '',
            street: newClient.street || '',
            city: newClient.city || '',
            zipcode: newClient.zipcode || '',
            country: newClient.country || '',
            user: {
                first_name: newClient.user?.first_name || '',
                last_name: newClient.user?.last_name || '',
                email: newClient.user?.email || '',
            }
        };
    }
}, { immediate: true, deep: true });

const validationRules = {
    'user.first_name': [
        { validator: v_required, message: "Le prénom est requis" }
    ],
    'user.last_name': [
        { validator: v_required, message: "Le nom est requis" }
    ],
    'user.email': [
        { validator: v_required, message: "L'email est requis" },
        { validator: v_email, message: "L'email n'est pas valide" }
    ],
    'phone': [
        { validator: v_required, message: "Le numéro de téléphone est requis" },
        { validator: v_minLength(10), message: "Le numéro de téléphone doit comporter 10 chiffres" }
    ],
};


const onSubmit = () => {
    alert("TOTOTOTOTO");
}

const loadUserClient = async () => {
    error.value = null;
    isLoading.value = true;

    try {
        // Attendre que la session soit restaurée si nécessaire
        if (!auth_store.isAuthenticated) await $directus.refresh();

        const req = await $directus.request<Clients[]>($readItems('clients', {
            filter: { user: { _eq: auth_store.user?.id } },
            fields: [
                'date_created', 'date_of_birth', 'phone', 'street', 'city', 'zipcode', 'country',
                { user: ['first_name', 'last_name', 'email', 'avatar'] }
            ]
        }));
        client.value = req[0];
    } catch (error: any) {
        console.error('Error loading client data:', error);
        const message = error.errors?.[0]?.message || "Une erreur est survenue lors du chargement des données";
        error.value = message;

        // Si on a une erreur 403, on essaie de recharger la session
        if (error.errors?.[0]?.extensions?.code === 'FORBIDDEN') {
            try {
                await $directus.refresh();
                // Réessayer de charger les données après rafraîchissement de la session
                const req = await $directus.request<Clients[]>($readItems('clients', {
                    filter: { user: { _eq: auth_store.user?.id } },
                    fields: [
                        'date_created', 'date_of_birth', 'phone', 'street', 'city', 'zipcode', 'country',
                        { user: ['first_name', 'last_name', 'email', 'avatar'] }
                    ]
                }));
                client.value = req[0];
                error.value = null;
            } catch (retryError) {
                console.error('Error after session refresh:', retryError);
                error.value = "Impossible de charger les données. Veuillez vous reconnecter.";
                auth_store.logout();
            }
        }
    } finally {
        isLoading.value = false;
    }
}

// const showQuestionnaireModal: Ref<boolean> = ref(false);

// const user_files: Ref<DirectusFiles[]> = ref([]);
// async function loadUserFiles() {
    // const req = await $directus.request($readFiles(
        // {
            // fields: ['*', 'user.in_charge_of_me.related_directus_users_id'],
            // //sort: '-date',
            // filter: {
                // user: { _eq: auth_store.user?.id }
            // }
        // }
    // ));
    // user_files.value = req as DirectusFiles[];
// };

onMounted(async () => {
    await loadUserClient();
});
</script>
