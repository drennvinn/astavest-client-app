// Types de base
export type ISODate = string; // Format: YYYY-MM-DD
export type Nullable<T> = T | null;
export type UUID = string;


// Statuts et états
export enum StepStatus {
    PENDING = 'pending',
    VALID = 'valid',
    ERROR = 'error'
}

export enum VerificationStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected'
}



// Interfaces des données par étape (alignées avec Directus)
export interface PersonalInformation {
    id: string;
    birth_date?: Nullable<ISODate>;
    address?: Nullable<string>;
    city?: Nullable<string>;
    country?: Nullable<UUID>;  // Référence à la collection Country
    postal_code?: Nullable<string>;
    phone?: Nullable<string>;
    is_pep?: Nullable<'yes' | 'no'>;
    function_country?: Nullable<UUID>;  // Référence à la collection Country
    function_entry_date?: Nullable<ISODate>;
    function_exit_date?: Nullable<ISODate>;
    function_exercised?: Nullable<string>;
    relation_name?: Nullable<string>;
    relation_link?: Nullable<string>;
    protection_regime?: Nullable<'yes' | 'no'>;
    legal_representative?: Nullable<string>;
    legal_status?: Nullable<string>;
    protection_type?: Nullable<string>;
}

export interface FamilySituation {
    id: string;
    marital_status?: Nullable<string>;
    marriage_date?: Nullable<ISODate>;
    marriage_contract?: Nullable<string>;
    matrimonial_regime?: Nullable<string>;
    divorce_date?: Nullable<ISODate>;
    number_of_children?: Nullable<number>;
    have_children?: Nullable<'yes' | 'no'>;
    dependent_children?: Nullable<number>;
    civil_solidarity_pact_date?: Nullable<ISODate>;
    civil_solidarity_pact_contract?: Nullable<string>;
    civil_solidarity_pact_regime?: Nullable<string>;
}

export interface ProfessionalSituation {
    id: string;
    status?: Nullable<string>;
    occupation?: Nullable<string>;
    activity_sector?: Nullable<string>;
    finance_experience?: Nullable<boolean>;
    company_name?: Nullable<string>;
    country_of_activity?: Nullable<string>;
    situation_start_date?: Nullable<ISODate>;
}

export interface FinancialSituation {
    id: string;
    annual_income?: Nullable<number>;
    income_sources?: Nullable<string[]>;
    total_assets?: Nullable<number>;
    modification_elements?: Nullable<string>;
    debts_credits?: Nullable<boolean>;
    debts_description?: Nullable<string>;
    different_tax_residence?: Nullable<boolean>;
    wealth_tax_liable?: Nullable<boolean>;
    tax_id_number?: Nullable<string>;
    mifii_identifier?: Nullable<string>;
    us_links?: Nullable<boolean>;
    us_tin?: Nullable<string>;
    tax_residence_country?: Nullable<UUID>;  // Référence à la collection Country
}

export interface KnowledgeExperience {
    id: string;
    monetary_products_holding?: Nullable<boolean>;
    monetary_products_duration?: Nullable<string>;
    monetary_products_frequency?: Nullable<string>;
    stocks_holding?: Nullable<boolean>;
    stocks_duration?: Nullable<string>;
    stocks_frequency?: Nullable<string>;
    crypto_holding?: Nullable<boolean>;
    crypto_duration?: Nullable<string>;
    crypto_frequency?: Nullable<string>;
    crypto_types?: Nullable<string>;
    portfolio_management_experience?: Nullable<boolean>;
    direct_management_experience?: Nullable<boolean>;
    stablecoins_knowledge?: Nullable<string>;
    tokens_knowledge?: Nullable<string>;
}

export interface InvestmentProfile {
    id: string;
    objectives?: Nullable<string>;
    objective_types?: Nullable<unknown>;
    desired_return?: Nullable<string>;
    main_objective?: Nullable<string>;
    investment_horizon?: Nullable<string>;
    risk_appetite?: Nullable<string>;
    crypto_risks_acceptance?: Nullable<boolean>;
    acceptable_loss?: Nullable<string>;
    exclusion_criteria?: Nullable<string>;
}

export interface SustainablePreferences {
    id: string;
    sustainability_integration?: Nullable<boolean>;
    taxonomy_percentage?: Nullable<number>;
    esg_preference?: Nullable<unknown>;
    extra_financial_priority?: Nullable<boolean>;
    impact_selection?: Nullable<boolean>;
    impact_details?: Nullable<string>;
}

export interface ClientDeclarations {
    id: string;
    aml_information?: Nullable<boolean>;
    answers_accuracy?: Nullable<boolean>;
    information_commitment?: Nullable<boolean>;
    der_reception?: Nullable<boolean>;
    dic_reception?: Nullable<boolean>;
    risk_report_reception?: Nullable<boolean>;
    signature_date?: Nullable<ISODate>;
    signature_place?: Nullable<string>;
}

export interface ClientDocuments {
    id: string;
    identity_card?: Nullable<string>;
    proof_of_address?: Nullable<string>;
    bank_details?: Nullable<string>;
    tax_notice?: Nullable<string>;
    income_declaration?: Nullable<string>;
    verification_status?: Nullable<VerificationStatus>;
}



// Type union de toutes les étapes possibles
export type StepKey =
    | 'personal_information'
    | 'family_situation'
    | 'professional_situation'
    | 'financial_situation'
    | 'knowledge_experience'
    | 'investment_profile'
    | 'sustainable_preferences'
    | 'declarations'
    | 'documents'
;


export interface StepComponentOptions {
    loadingDelay?: number;
    timeout?: number;
    maxRetries?: number;
}


// Interface pour la configuration des étapes
export interface WizardStepConfig {
    key: StepKey;
    title: string;
    description: string;
    icon?: string;
    order: number;
    required: boolean;
}

// État d'une étape dans le wizard
export interface WizardStepState<T = any> {
    data: T;
    status: StepStatus;
    errors: ValidationError[];
    lastModified: string;  // ISO date string
    isVisited: boolean;
}

// Interface d'erreur de validation
export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}

// Type union de toutes les données des étapes
export type StepData =
    | PersonalInformation
    | FamilySituation
    | ProfessionalSituation
    | FinancialSituation
    | KnowledgeExperience
    | InvestmentProfile
    | SustainablePreferences
    | ClientDeclarations
    | ClientDocuments;

// État global du wizard
export interface WizardState {
    steps: Record<StepKey, WizardStepState>;
    currentStep: StepKey;
    lastSaved: Nullable<string>;  // ISO date string
    globalErrors: ValidationError[];
    isSubmitting: boolean;
    autoSave: {
        pending: boolean;
        lastAttempt: Nullable<string>;
        error: Nullable<ValidationError>;
    };
}

// Types pour la validation
export interface ValidationRule<T = any> {
    validator: (value: T, formData?: any) => boolean | Promise<boolean>;
    message: string;
    code?: string;
    dependencies?: string[];
}

export type ValidationRules<T = any> = {
    [K in keyof T]?: ValidationRule<T[K]>[];
};