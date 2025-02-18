import { defineStore } from 'pinia';
import { DirectusUsers } from '~/types';
import api from '~/composables/api';
import { highlightedLog } from '~/utils/dev';
import { useAuth } from '~/stores/auth';


interface AdvisorState {
    advisors: DirectusUsers[] | null,
}


export const useAdvisor = defineStore('advisors', {

    persist: true,

    state: (): AdvisorState => ({
        advisors: {} as DirectusUsers[] | null,
    }),

    // getters: {},

    actions: {

        async fetchAdvisors() {
            const auth_store = useAuth();
            try {
                const access_token = await auth_store.getToken();
                const req = await api.get(
                    'directus-custom-routes/in-charge-of-me',
                    { headers: { Authorization: `Bearer ${access_token}` } }
                );
                highlightedLog('advisors', req.data);
                this.advisors = req.data;
            } catch(e) {
                console.log('erreur lors de la récupération des advisors', e);
            }
        },

    }
});



