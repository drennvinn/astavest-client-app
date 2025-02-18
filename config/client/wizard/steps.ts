import { defineAsyncComponent } from 'vue';
import type {
    StepKey,
    WizardStepConfig,
} from '~/types/client/wizard';




// Configuration des étapes
export const STEP_CONFIG: Record<StepKey, WizardStepConfig> = {
    personal_information: {
        key: 'personal_information',
        title: 'Informations personnelles',
        description: "Veuillez renseigner ici vos informations d'identité et de contact",
        icon: 'user',
        order: 1,
        required: true
    },
    family_situation: {
        key: 'family_situation',
        title: 'Situation familiale',
        description: 'Votre situation matrimoniale et familiale',
        icon: 'users',
        order: 2,
        required: true
    },
    professional_situation: {
        key: 'professional_situation',
        title: 'Situation professionnelle',
        description: 'Votre activité professionnelle actuelle',
        icon: 'briefcase',
        order: 3,
        required: true
    },
    financial_situation: {
        key: 'financial_situation',
        title: 'Situation financière',
        description: 'Vos revenus et votre patrimoine',
        icon: 'wallet',
        order: 4,
        required: true
    },
    knowledge_experience: {
        key: 'knowledge_experience',
        title: 'Connaissances et expérience',
        description: 'Votre expérience en matière d\'investissement',
        icon: 'brain',
        order: 5,
        required: true
    },
    investment_profile: {
        key: 'investment_profile',
        title: 'Profil d\'investissement',
        description: 'Vos objectifs et votre tolérance au risque',
        icon: 'chart',
        order: 6,
        required: true
    },
    sustainable_preferences: {
        key: 'sustainable_preferences',
        title: 'Préférences ESG',
        description: 'Vos préférences en matière d\'investissement durable',
        icon: 'leaf',
        order: 7,
        required: true
    },
    declarations: {
        key: 'declarations',
        title: 'Déclarations',
        description: 'Vos engagements et confirmations',
        icon: 'file-check',
        order: 8,
        required: true
    },
    documents: {
        key: 'documents',
        title: 'Documents justificatifs',
        description: 'Les documents nécessaires à la validation de votre dossier',
        icon: 'files',
        order: 9,
        required: true
    }
};