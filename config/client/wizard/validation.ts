// config/client/wizard/validation.ts
import { ERROR_MESSAGES } from './constants';
import type {
    ValidationRules,
    StepKey,
    WizardStepConfig,
    PersonalInformation,
    FamilySituation,
    ProfessionalSituation,
    FinancialSituation,
    KnowledgeExperience,
    InvestmentProfile,
    SustainablePreferences,
    ClientDeclarations,
    ClientDocuments
} from '~/types/client/wizard';





// Règles de validation par étape
export const VALIDATION_RULES: Record<string, ValidationRules> = {
    personal_information: {
        birth_date: [
            {
                validator: v_required,
                message: ERROR_MESSAGES.REQUIRED
            },
            {
                validator: v_isValidDate,
                message: ERROR_MESSAGES.INVALID_DATE
            },
            {
                validator: v_isAdult,
                message: ERROR_MESSAGES.AGE_REQUIREMENT
            }
        ],
        phone: [
            {
                validator: v_required,
                message: ERROR_MESSAGES.REQUIRED
            },
            {
                validator: v_isValidPhone,
                message: ERROR_MESSAGES.INVALID_PHONE
            }
        ],
        address: [{
            validator: v_required,
            message: ERROR_MESSAGES.REQUIRED
        }],
        postal_code: [
            {
                validator: v_required,
                message: ERROR_MESSAGES.REQUIRED
            },
            {
                validator: v_isValidPostalCode,
                message: ERROR_MESSAGES.INVALID_POSTAL_CODE
            }
        ],
        city: [{
            validator: v_required,
            message: ERROR_MESSAGES.REQUIRED
        }],
        country: [{
            validator: v_required,
            message: ERROR_MESSAGES.REQUIRED
        }],
        is_pep: [{
            validator: v_required,
            message: ERROR_MESSAGES.REQUIRED
        }],
        function_exercised: [{
            validator: (value, formData) =>
                formData?.is_pep !== 'yes' || v_required(value),
            message: ERROR_MESSAGES.REQUIRED,
            dependencies: ['is_pep']
        }],
        function_country: [{
            validator: (value, formData) =>
                formData?.is_pep !== 'yes' || v_required(value),
            message: ERROR_MESSAGES.REQUIRED,
            dependencies: ['is_pep']
        }],
        function_entry_date: [{
            validator: (value, formData) =>
                formData?.is_pep !== 'yes' || (v_required(value) && v_isValidDate(value)),
            message: ERROR_MESSAGES.REQUIRED,
            dependencies: ['is_pep']
        }],
        protection_regime: [{
            validator: v_required,
            message: ERROR_MESSAGES.REQUIRED
        }],
        legal_representative: [{
            validator: (value, formData) =>
                formData?.protection_regime !== 'yes' || v_required(value),
            message: ERROR_MESSAGES.REQUIRED,
            dependencies: ['protection_regime']
        }]
    },

    family_situation: {
        marital_status: [{
            validator: v_required,
            message: ERROR_MESSAGES.REQUIRED
        }],
        marriage_date: [{
            validator: (value, formData) =>
                formData?.marital_status !== 'married' || (v_required(value) && v_isValidDate(value)),
            message: ERROR_MESSAGES.REQUIRED,
            dependencies: ['marital_status']
        }],
        matrimonial_regime: [{
            validator: (value, formData) =>
                formData?.marital_status !== 'married' || v_required(value),
            message: ERROR_MESSAGES.REQUIRED,
            dependencies: ['marital_status']
        }],
        have_children: [{
            validator: v_required,
            message: ERROR_MESSAGES.REQUIRED
        }],
        number_of_children: [{
            validator: (value, formData) =>
                formData?.have_children !== 'yes' || v_required(value),
            message: ERROR_MESSAGES.REQUIRED,
            dependencies: ['have_children']
        }],
        dependent_children: [{
            validator: (value, formData) => {
                if (formData?.have_children !== 'yes') return true;
                if (!v_required(value)) return false;
                return value <= (formData.number_of_children || 0);
            },
            message: ERROR_MESSAGES.INVALID_DEPENDENT_CHILDREN,
            dependencies: ['have_children', 'number_of_children']
        }]
    },

    professional_situation: {
        company_name: [
            {
                validator: (value: string, formData: ProfessionalSituation) => {
                    return formData.status !== 'employed' || !!value;
                },
                message: ERROR_MESSAGES.COMPANY_DETAILS_REQUIRED,
                dependencies: ['status']
            }
        ],
        activity_sector: [
            {
                validator: (value: string, formData: ProfessionalSituation) => {
                    return formData.status !== 'employed' || !!value;
                },
                message: ERROR_MESSAGES.ACTIVITY_SECTOR_REQUIRED,
                dependencies: ['status']
            }
        ],
        situation_start_date: [
            {
                validator: (value: string, formData: ProfessionalSituation) => {
                    return formData.status !== 'employed' || !!value;
                },
                message: ERROR_MESSAGES.SITUATION_START_DATE_REQUIRED,
                dependencies: ['status']
            }
        ]
    },

    financial_situation: {
        annual_income: [{
            validator: v_isPositiveNumber,
            message: ERROR_MESSAGES.INVALID_ANNUAL_INCOME
        }],
        total_assets: [{
            validator: v_isPositiveNumber,
            message: ERROR_MESSAGES.INVALID_TOTAL_ASSETS
        }],
        us_tin: [
            {
                validator: (value: string, formData: FinancialSituation) => {
                    return !formData.us_links || !!value;
                },
                message: ERROR_MESSAGES.US_TIN_REQUIRED,
                dependencies: ['us_links']
            }
        ],
        debts_description: [
            {
                validator: (value: string, formData: FinancialSituation) => {
                    return !formData.debts_credits || !!value;
                },
                message: ERROR_MESSAGES.DEBTS_DESCRIPTION_REQUIRED,
                dependencies: ['debts_credits']
            }
        ],
        mifii_identifier: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.MIFID_REQUIRED
            }
        ]
    },

    knowledge_experience: {
        crypto_duration: [
            {
                validator: (value: string, formData: KnowledgeExperience) => {
                    return !formData.crypto_holding || !!value;
                },
                message: ERROR_MESSAGES.CRYPTO_EXPERIENCE_REQUIRED,
                dependencies: ['crypto_holding']
            }
        ],
        crypto_frequency: [
            {
                validator: (value: string, formData: KnowledgeExperience) => {
                    return !formData.crypto_holding || !!value;
                },
                message: ERROR_MESSAGES.FREQUENCY_REQUIRED,
                dependencies: ['crypto_holding']
            }
        ],
        stocks_duration: [
            {
                validator: (value: string, formData: KnowledgeExperience) => {
                    return !formData.stocks_holding || !!value;
                },
                message: ERROR_MESSAGES.STOCKS_EXPERIENCE_REQUIRED,
                dependencies: ['stocks_holding']
            }
        ],
        stocks_frequency: [
            {
                validator: (value: string, formData: KnowledgeExperience) => {
                    return !formData.stocks_holding || !!value;
                },
                message: ERROR_MESSAGES.FREQUENCY_REQUIRED,
                dependencies: ['stocks_holding']
            }
        ]
    },

    investment_profile: {
        investment_horizon: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.INVESTMENT_HORIZON_REQUIRED
            }
        ],
        risk_appetite: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.RISK_PROFILE_REQUIRED
            }
        ],
        acceptable_loss: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.LOSS_TOLERANCE_REQUIRED
            }
        ],
        crypto_risks_acceptance: [
            {
                validator: (value: boolean) => value === true,
                message: ERROR_MESSAGES.CRYPTO_RISKS_REQUIRED
            }
        ],
        main_objective: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.OBJECTIVES_REQUIRED
            }
        ]
    },

    sustainable_preferences: {
        taxonomy_percentage: [{
            validator: (value) => v_isNumberInRange(value, 0, 100),
            message: ERROR_MESSAGES.INVALID_TAXONOMY_PERCENTAGE,
            dependencies: ['sustainability_integration']
        }],
        esg_preference: [
            {
                validator: (value: unknown) => value !== null && value !== undefined,
                message: ERROR_MESSAGES.ESG_PREFERENCES_REQUIRED
            }
        ],
        impact_details: [
            {
                validator: (value: string, formData: SustainablePreferences) => {
                    return !formData.impact_selection || !!value;
                },
                message: ERROR_MESSAGES.IMPACT_DETAILS_REQUIRED,
                dependencies: ['impact_selection']
            }
        ]
    },

    declarations: {
        aml_information: [
            {
                validator: (value: boolean) => value === true,
                message: ERROR_MESSAGES.AML_ACCEPTANCE_REQUIRED
            }
        ],
        der_reception: [
            {
                validator: (value: boolean) => value === true,
                message: ERROR_MESSAGES.DER_ACCEPTANCE_REQUIRED
            }
        ],
        dic_reception: [
            {
                validator: (value: boolean) => value === true,
                message: ERROR_MESSAGES.DIC_ACCEPTANCE_REQUIRED
            }
        ],
        risk_report_reception: [
            {
                validator: (value: boolean) => value === true,
                message: ERROR_MESSAGES.RISK_REPORT_REQUIRED
            }
        ],
        answers_accuracy: [
            {
                validator: (value: boolean) => value === true,
                message: ERROR_MESSAGES.REQUIRED
            }
        ],
        information_commitment: [
            {
                validator: (value: boolean) => value === true,
                message: ERROR_MESSAGES.REQUIRED
            }
        ],
        signature_date: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.SIGNATURE_DATE_REQUIRED
            }
        ],
        signature_place: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.SIGNATURE_PLACE_REQUIRED
            }
        ]
    },

    documents: {
        identity_card: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.DOCUMENT_REQUIRED
            }
        ],
        proof_of_address: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.DOCUMENT_REQUIRED
            }
        ],
        bank_details: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.DOCUMENT_REQUIRED
            }
        ],
        income_declaration: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.DOCUMENT_REQUIRED
            }
        ],
        tax_notice: [
            {
                validator: (value: string) => !!value,
                message: ERROR_MESSAGES.DOCUMENT_REQUIRED
            }
        ],
        verification_status: [
            {
                validator: (value: string) => value === 'verified',
                message: ERROR_MESSAGES.VERIFICATION_PENDING
            }
        ]
    }
};