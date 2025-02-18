// config/client/wizard/constants.ts


export const ERROR_MESSAGES = {

    // Messages généraux
    REQUIRED: 'Ce champ est obligatoire',
    SAVE_ERROR: 'Une erreur est survenue lors de la sauvegarde',
    VALIDATION_ERROR: 'Veuillez corriger les erreurs avant de continuer',
    SERVER_ERROR: 'Une erreur est survenue, veuillez réessayer',
    INVALID_DATE: 'Date invalide',

    // Informations personnelles
    AGE_REQUIREMENT: 'Vous devez avoir au moins 18 ans',
    INVALID_PHONE: 'Format de téléphone invalide',
    INVALID_POSTAL_CODE: 'Code postal invalide',
    PEP_FUNCTION_REQUIRED: 'La fonction exercée est requise pour les PPE',
    PEP_COUNTRY_REQUIRED: 'Le pays d\'exercice est requis pour les PPE',
    PEP_DATES_REQUIRED: 'Les dates d\'entrée et de sortie sont requises pour les PPE',
    RELATION_DETAILS_REQUIRED: 'Les informations sur la relation sont requises',
    PROTECTION_DETAILS_REQUIRED: 'Les détails du régime de protection sont requis',

    // Situation familiale
    MARRIAGE_CONTRACT_REQUIRED: 'Le contrat de mariage est requis',
    MATRIMONIAL_REGIME_REQUIRED: 'Le régime matrimonial est requis',
    PACS_DETAILS_REQUIRED: 'Les détails du PACS sont requis',
    PACS_DATE_REQUIRED: 'La date du PACS est requise',
    PACS_REGIME_REQUIRED: 'Le régime du PACS est requis',
    DIVORCE_DATE_REQUIRED: 'La date de divorce est requise',
    INVALID_CHILDREN_COUNT: 'Le nombre d\'enfants doit être un nombre positif',
    INVALID_DEPENDENT_CHILDREN: 'Le nombre d\'enfants à charge doit être un nombre positif',

    // Situation professionnelle
    COMPANY_DETAILS_REQUIRED: 'Les détails de l\'entreprise sont requis',
    ACTIVITY_SECTOR_REQUIRED: 'Le secteur d\'activité est requis',
    SITUATION_START_DATE_REQUIRED: 'La date de début est requise',
    COUNTRY_OF_ACTIVITY_REQUIRED: 'Le pays d\'activité est requis',

    // Situation financière
    INVALID_ANNUAL_INCOME: 'Le revenu annuel doit être un nombre positif',
    INVALID_TOTAL_ASSETS: 'Le patrimoine total doit être un nombre positif',
    TAX_DETAILS_REQUIRED: 'Les informations fiscales sont requises',
    US_TIN_REQUIRED: 'Le numéro TIN est requis pour les liens avec les États-Unis',
    DEBTS_DESCRIPTION_REQUIRED: 'La description des dettes est requise',
    MIFID_REQUIRED: 'L\'identifiant MiFID est requis',

    // Connaissances et expérience
    CRYPTO_EXPERIENCE_REQUIRED: 'Les détails de l\'expérience en crypto sont requis',
    STOCKS_EXPERIENCE_REQUIRED: 'Les détails de l\'expérience en actions sont requis',
    KNOWLEDGE_LEVEL_REQUIRED: 'Le niveau de connaissance est requis',
    FREQUENCY_REQUIRED: 'La fréquence de trading est requise',

    // Profil d'investissement
    INVESTMENT_HORIZON_REQUIRED: 'L\'horizon d\'investissement est requis',
    RISK_PROFILE_REQUIRED: 'Le profil de risque est requis',
    OBJECTIVES_REQUIRED: 'Les objectifs d\'investissement sont requis',
    LOSS_TOLERANCE_REQUIRED: 'La tolérance aux pertes est requise',
    CRYPTO_RISKS_REQUIRED: 'L\'acceptation des risques crypto est requise',

    // Préférences durables
    INVALID_TAXONOMY_PERCENTAGE: 'Le pourcentage taxonomie doit être compris entre 0 et 100',
    ESG_PREFERENCES_REQUIRED: 'Les préférences ESG sont requises',
    IMPACT_DETAILS_REQUIRED: 'Les détails d\'impact sont requis',

    // Documents et déclarations
    DOCUMENT_REQUIRED: 'Ce document est requis',
    VERIFICATION_PENDING: 'En attente de vérification',
    AML_ACCEPTANCE_REQUIRED: 'Vous devez accepter les informations LCB-FT',
    DER_ACCEPTANCE_REQUIRED: 'Vous devez confirmer la réception du DER',
    DIC_ACCEPTANCE_REQUIRED: 'Vous devez confirmer la réception du DIC',
    RISK_REPORT_REQUIRED: 'Vous devez confirmer la réception du rapport de risque',
    SIGNATURE_REQUIRED: 'La signature est requise',
    SIGNATURE_PLACE_REQUIRED: 'Le lieu de signature est requis',
    SIGNATURE_DATE_REQUIRED: 'La date de signature est requise'

} as const;



export const AUTO_SAVE_DELAY = 1000; // en millisecondes

// Autres constantes utiles
export const DATE_FORMAT = 'YYYY-MM-DD';
export const PHONE_FORMAT = '+33 6 12 34 56 78';