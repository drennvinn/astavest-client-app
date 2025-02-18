export type CgpCif = {
    address?: string | null;
    approved_association_certificate?: string | DirectusFiles | null;
    attestation_orias?: string | DirectusFiles | null;
    cgp_cif_association?: string | CgpCifAssociation | null;
    cgp_id?: string | null;
    city?: string | null;
    clients: any[] | Clients[];
    company_status?: number | CompaniesStatus | null;
    country?: string | Country | null;
    date_created?: string | null;
    date_updated?: string | null;
    id: string;
    KBIS?: string | DirectusFiles | null;
    legal_person: string;
    RCP?: string | DirectusFiles | null;
    representatives: any[] | CgpCifRepresentative[];
    RIB?: string | DirectusFiles | null;
    sort?: number | null;
    status: string;
    user?: string | DirectusUsers | null;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
    zipcode?: string | null;
};

export type CgpCifAssociation = {
    address?: string | null;
    approved_association_certificate?: string | DirectusFiles | null;
    attestation_orias?: string | DirectusFiles | null;
    cgp_asso_id?: string | null;
    cgp_cif: any[] | CgpCif[];
    city?: string | null;
    company_status?: number | CompaniesStatus | null;
    country?: string | Country | null;
    date_created?: string | null;
    date_updated?: string | null;
    id: string;
    KBIS?: string | DirectusFiles | null;
    legal_person: string;
    RCP?: string | DirectusFiles | null;
    representatives: any[] | CgpCifAssociationRepresentative[];
    RIB?: string | DirectusFiles | null;
    sort?: number | null;
    status: string;
    user?: string | DirectusUsers | null;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
    zipcode?: string | null;
};

export type CgpCifAssociationRepresentative = {
    cgp_cif_association_id?: string | CgpCifAssociation | null;
    id: number;
    representative_id?: string | Representative | null;
};

export type CgpCifRepresentative = {
    cgp_cif_id?: string | CgpCif | null;
    id: number;
    representative_id?: string | Representative | null;
};

export type ClientDeclarations = {
    aml_information?: boolean | null;
    answers_accuracy?: boolean | null;
    der_reception?: boolean | null;
    dic_reception?: boolean | null;
    id: string;
    information_commitment?: boolean | null;
    risk_report_reception?: boolean | null;
    signature_date?: string | null;
    signature_place?: string | null;
};

export type ClientDocuments = {
    bank_details?: string | null;
    id: string;
    identity_card?: string | null;
    income_declaration?: string | null;
    proof_of_address?: string | null;
    tax_notice?: string | null;
    verification_status?: string | null;
};

export type Clients = {
    cgp_cif?: string | CgpCif | null;
    client_id?: string | null;
    date_created?: string | null;
    date_updated?: string | null;
    declarations?: string | ClientDeclarations | null;
    documents?: string | ClientDocuments | null;
    family_situation?: string | FamilySituation | null;
    financial_situation?: string | FinancialSituation | null;
    id: string;
    investment_profile?: string | InvestmentProfile | null;
    knowledge_experience?: string | KnowledgeExperience | null;
    personal_information?: string | PersonalInformation | null;
    professional_situation?: string | ProfessionalSituation | null;
    status: string;
    sustainable_preferences?: string | SustainablePreferences | null;
    user?: string | DirectusUsers | null;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
};

export type CompaniesStatus = {
    id: number;
    identifier?: string | null;
    name?: string | null;
    sort?: number | null;
};

export type ComplaintForm = {
    comments?: string | null;
    contact_details: string;
    contact_details_addr_city?: string | null;
    contact_details_addr_country?: string | null;
    contact_details_addr_floor?: string | null;
    contact_details_addr_number?: string | null;
    contact_details_addr_street_name?: string | null;
    contact_details_addr_zipcode?: string | null;
    contact_details_address: string;
    contact_details_email?: string | null;
    contact_details_first_name?: string | null;
    contact_details_last_name?: string | null;
    contact_details_phone_number?: string | null;
    crypto_service_or_agreement?: string | null;
    current_situation_and_desired_solution?: string | null;
    date_created?: string | null;
    date_of_the_facts_leading_to_the_claim?: string | null;
    date_updated?: string | null;
    description_of_damage?: string | null;
    description_of_the_request?: string | null;
    files: any[] | ComplaintFormFiles[];
    id: string;
    information_regarding_the_claim: string;
    is_astavest_client?: string | null;
    personal_data: string;
    personal_data_addr_city?: string | null;
    personal_data_addr_country?: string | null;
    personal_data_addr_floor?: string | null;
    personal_data_addr_number?: string | null;
    personal_data_addr_street_name?: string | null;
    personal_data_addr_zipcode?: string | null;
    personal_data_address: string;
    personal_data_email?: string | null;
    personal_data_first_name?: string | null;
    personal_data_last_name?: string | null;
    personal_data_phone_number?: string | null;
    reason_for_request?: string | null;
    status: string;
    the_parties_concerned?: string | null;
    user: any[] | ComplaintFormDirectusUsers[];
    user_updated?: string | DirectusUsers | null;
};

export type ComplaintFormDirectusUsers = {
    complaint_form_id?: string | ComplaintForm | null;
    directus_users_id?: string | DirectusUsers | null;
    id: number;
};

export type ComplaintFormFiles = {
    complaint_form_id?: string | ComplaintForm | null;
    directus_files_id?: string | DirectusFiles | null;
    id: number;
};

export type Country = {
    id: string;
    name?: string | null;
    nationality?: string | null;
    risk?: string | Risk | null;
    risk_nature?: string | null;
    sort?: number | null;
    sources?: string | null;
    status: string;
};

export type CryptoAnalysis = {
    additional_informations: string;
    asset_itentification: string;
    associated_risks?: string | null;
    clear_governance?: string | null;
    clear_governance_information?: string | null;
    co2_per_transaction?: string | null;
    competitors?: string | null;
    consensus_mecanism?: string | null;
    consumption_over_500000kwh?: string | null;
    date_created?: string | null;
    date_updated?: string | null;
    description_of_business_model?: string | null;
    does_asset_promote_anonymity?: string | null;
    environmental?: string | null;
    esg_analysis: string;
    financial_informations_and_performance: string;
    formatted_esg?: string | null;
    icon?: string | DirectusFiles | null;
    id: string;
    included_in_astavest_universe?: string | null;
    information_on_environmental_protection?: string | null;
    information_on_inflation_protection?: string | null;
    known_for?: string | null;
    known_team_experience?: string | null;
    kyc_and_lcbft?: string | null;
    liquidity_over_200m?: string | null;
    name_and_symbol?: string | null;
    number_of_assets?: string | null;
    older_than_two_years?: string | null;
    other_informations?: string | null;
    pca_protocol?: string | null;
    potential_profits?: number | null;
    project_started_date?: string | null;
    protection_against_inflation?: string | null;
    real_world_utility?: string | null;
    reason_for_exclusion?: string | null;
    risk_evaluation: string;
    risk_level?: number | null;
    sensitive_information_protection?: string | null;
    smart_contract_or_blockchain?: string | null;
    social_action_description?: string | null;
    social_actions?: string | null;
    sort?: number | null;
    total_kwh_by_transaction?: string | null;
    total_score?: number | null;
    transaction_data?: string | null;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
};

export type DirectusAccess = {
    id: string;
    policy: string | DirectusPolicies;
    role?: string | DirectusRoles | null;
    sort?: number | null;
    user?: string | DirectusUsers | null;
};

export type DirectusActivity = {
    action: string;
    collection: string;
    comment?: string | null;
    id: number;
    ip?: string | null;
    item: string;
    origin?: string | null;
    revisions: any[] | DirectusRevisions[];
    timestamp: string;
    user?: string | DirectusUsers | null;
    user_agent?: string | null;
};

export type DirectusCollections = {
    accountability?: string | null;
    archive_app_filter: boolean;
    archive_field?: string | null;
    archive_value?: string | null;
    collapse: string;
    collection: string;
    color?: string | null;
    display_template?: string | null;
    group?: string | DirectusCollections | null;
    hidden: boolean;
    icon?: string | null;
    item_duplication_fields?: unknown | null;
    note?: string | null;
    preview_url?: string | null;
    singleton: boolean;
    sort?: number | null;
    sort_field?: string | null;
    translations?: unknown | null;
    unarchive_value?: string | null;
    versioning: boolean;
};

export type DirectusComments = {
    collection: string | DirectusCollections;
    comment: string;
    date_created?: string | null;
    date_updated?: string | null;
    id: string;
    item: string;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
};

export type DirectusDashboards = {
    color?: string | null;
    date_created?: string | null;
    icon: string;
    id: string;
    name: string;
    note?: string | null;
    panels: any[] | DirectusPanels[];
    user_created?: string | DirectusUsers | null;
};

export type DirectusExtensions = {
    bundle?: string | null;
    enabled: boolean;
    folder: string;
    id: string;
    source: string;
};

export type DirectusFields = {
    collection: string | DirectusCollections;
    conditions?: unknown | null;
    display?: string | null;
    display_options?: unknown | null;
    field: string;
    group?: string | DirectusFields | null;
    hidden: boolean;
    id: number;
    interface?: string | null;
    note?: string | null;
    options?: unknown | null;
    readonly: boolean;
    required?: boolean | null;
    sort?: number | null;
    special?: unknown | null;
    translations?: unknown | null;
    validation?: unknown | null;
    validation_message?: string | null;
    width?: string | null;
};

export type DirectusFiles = {
    charset?: string | null;
    created_on: string;
    description?: string | null;
    duration?: number | null;
    embed?: string | null;
    filename_disk?: string | null;
    filename_download: string;
    filesize?: number | null;
    focal_point_x?: number | null;
    focal_point_y?: number | null;
    folder?: string | DirectusFolders | null;
    height?: number | null;
    id: string;
    location?: string | null;
    metadata?: unknown | null;
    modified_by?: string | DirectusUsers | null;
    modified_on: string;
    storage: string;
    tags?: unknown | null;
    title?: string | null;
    tus_data?: unknown | null;
    tus_id?: string | null;
    type?: string | null;
    uploaded_by?: string | DirectusUsers | null;
    uploaded_on?: string | null;
    width?: number | null;
};

export type DirectusFlows = {
    accountability?: string | null;
    color?: string | null;
    date_created?: string | null;
    description?: string | null;
    icon?: string | null;
    id: string;
    name: string;
    operation?: string | DirectusOperations | null;
    operations: any[] | DirectusOperations[];
    options?: unknown | null;
    status: string;
    trigger?: string | null;
    user_created?: string | DirectusUsers | null;
};

export type DirectusFolders = {
    id: string;
    name: string;
    parent?: string | DirectusFolders | null;
};

export type DirectusMigrations = {
    name: string;
    timestamp?: string | null;
    version: string;
};

export type DirectusNotifications = {
    collection?: string | null;
    id: number;
    item?: string | null;
    message?: string | null;
    recipient: string | DirectusUsers;
    sender?: string | DirectusUsers | null;
    status?: string | null;
    subject: string;
    timestamp?: string | null;
};

export type DirectusOperations = {
    date_created?: string | null;
    flow: string | DirectusFlows;
    id: string;
    key: string;
    name?: string | null;
    options?: unknown | null;
    position_x: number;
    position_y: number;
    reject?: string | DirectusOperations | null;
    resolve?: string | DirectusOperations | null;
    type: string;
    user_created?: string | DirectusUsers | null;
};

export type DirectusPanels = {
    color?: string | null;
    dashboard: string | DirectusDashboards;
    date_created?: string | null;
    height: number;
    icon?: string | null;
    id: string;
    name?: string | null;
    note?: string | null;
    options?: unknown | null;
    position_x: number;
    position_y: number;
    show_header: boolean;
    type: string;
    user_created?: string | DirectusUsers | null;
    width: number;
};

export type DirectusPermissions = {
    action: string;
    collection: string;
    fields?: unknown | null;
    id: number;
    permissions?: unknown | null;
    policy: string | DirectusPolicies;
    presets?: unknown | null;
    validation?: unknown | null;
};

export type DirectusPolicies = {
    admin_access: boolean;
    app_access: boolean;
    description?: string | null;
    enforce_tfa: boolean;
    icon: string;
    id: string;
    ip_access?: unknown | null;
    name: string;
    permissions: any[] | DirectusPermissions[];
    roles: any[] | DirectusAccess[];
    users: any[] | DirectusAccess[];
};

export type DirectusPresets = {
    bookmark?: string | null;
    collection?: string | null;
    color?: string | null;
    filter?: unknown | null;
    icon?: string | null;
    id: number;
    layout?: string | null;
    layout_options?: unknown | null;
    layout_query?: unknown | null;
    refresh_interval?: number | null;
    role?: string | DirectusRoles | null;
    search?: string | null;
    user?: string | DirectusUsers | null;
};

export type DirectusRelations = {
    id: number;
    junction_field?: string | null;
    many_collection: string;
    many_field: string;
    one_allowed_collections?: unknown | null;
    one_collection?: string | null;
    one_collection_field?: string | null;
    one_deselect_action: string;
    one_field?: string | null;
    sort_field?: string | null;
};

export type DirectusRevisions = {
    activity: number | DirectusActivity;
    collection: string;
    data?: unknown | null;
    delta?: unknown | null;
    id: number;
    item: string;
    parent?: number | DirectusRevisions | null;
    version?: string | DirectusVersions | null;
};

export type DirectusRoles = {
    children: any[] | DirectusRoles[];
    description?: string | null;
    icon: string;
    id: string;
    name: string;
    parent?: string | DirectusRoles | null;
    policies: any[] | DirectusAccess[];
    slug?: string | null;
    users: any[] | DirectusUsers[];
    users_group: string;
};

export type DirectusSessions = {
    expires: string;
    ip?: string | null;
    next_token?: string | null;
    origin?: string | null;
    share?: string | DirectusShares | null;
    token: string;
    user?: string | DirectusUsers | null;
    user_agent?: string | null;
};

export type DirectusSettings = {
    auth_login_attempts?: number | null;
    auth_password_policy?: string | null;
    basemaps?: unknown | null;
    custom_aspect_ratios?: unknown | null;
    custom_css?: string | null;
    default_appearance: string;
    default_language: string;
    default_theme_dark?: string | null;
    default_theme_light?: string | null;
    id: number;
    mapbox_key?: string | null;
    module_bar?: unknown | null;
    project_color: string;
    project_descriptor?: string | null;
    project_logo?: string | DirectusFiles | null;
    project_name: string;
    project_url?: string | null;
    public_background?: string | DirectusFiles | null;
    public_favicon?: string | DirectusFiles | null;
    public_foreground?: string | DirectusFiles | null;
    public_note?: string | null;
    public_registration: boolean;
    public_registration_email_filter?: unknown | null;
    public_registration_role?: string | DirectusRoles | null;
    public_registration_verify_email: boolean;
    report_bug_url?: string | null;
    report_error_url?: string | null;
    report_feature_url?: string | null;
    storage_asset_presets?: unknown | null;
    storage_asset_transform?: string | null;
    storage_default_folder?: string | DirectusFolders | null;
    theme_dark_overrides?: unknown | null;
    theme_light_overrides?: unknown | null;
    theming_group: string;
};

export type DirectusShares = {
    collection: string | DirectusCollections;
    date_created?: string | null;
    date_end?: string | null;
    date_start?: string | null;
    id: string;
    item: string;
    max_uses?: number | null;
    name?: string | null;
    password?: string | null;
    role?: string | DirectusRoles | null;
    times_used?: number | null;
    user_created?: string | DirectusUsers | null;
};

export type DirectusTranslations = {
    id: string;
    key: string;
    language: string;
    value: string;
};

export type DirectusUsers = {
    appearance?: string | null;
    auth_data?: unknown | null;
    avatar?: string | DirectusFiles | null;
    client: any[] | Clients[];
    description?: string | null;
    email?: string | null;
    email_notifications?: boolean | null;
    external_identifier?: string | null;
    first_name?: string | null;
    id: string;
    language?: string | null;
    last_access?: string | null;
    last_name?: string | null;
    last_page?: string | null;
    location?: string | null;
    password?: string | null;
    pipeline_column?: string | PipelineColumn | null;
    policies: any[] | DirectusAccess[];
    provider: string;
    role?: string | DirectusRoles | null;
    status: string;
    tags?: unknown | null;
    tfa_secret?: string | null;
    theme_dark?: string | null;
    theme_dark_overrides?: unknown | null;
    theme_light?: string | null;
    theme_light_overrides?: unknown | null;
    title?: string | null;
    token?: string | null;
};

export type DirectusVersions = {
    collection: string | DirectusCollections;
    date_created?: string | null;
    date_updated?: string | null;
    delta?: unknown | null;
    hash?: string | null;
    id: string;
    item: string;
    key: string;
    name?: string | null;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
};

export type DirectusWebhooks = {
    actions: unknown;
    collections: unknown;
    data: boolean;
    headers?: unknown | null;
    id: number;
    method: string;
    migrated_flow?: string | DirectusFlows | null;
    name: string;
    status: string;
    url: string;
    was_active_before_deprecation: boolean;
};

export type FamilySituation = {
    civil_solidarity_pact_contract?: string | null;
    civil_solidarity_pact_date?: string | null;
    civil_solidarity_pact_regime?: string | null;
    dependent_children?: number | null;
    divorce_date?: string | null;
    have_children?: string | null;
    id: string;
    marital_status?: string | null;
    marriage_contract?: string | null;
    marriage_date?: string | null;
    matrimonial_regime?: string | null;
    number_of_children?: number | null;
};

export type FinancialGroups = {
    date_created?: string | null;
    date_updated?: string | null;
    id: string;
    sort?: number | null;
    status: string;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
};

export type FinancialSituation = {
    annual_income?: number | null;
    debts_credits?: boolean | null;
    debts_description?: string | null;
    different_tax_residence?: boolean | null;
    id: string;
    income_sources?: unknown | null;
    mifii_identifier?: string | null;
    modification_elements?: string | null;
    tax_id_number?: string | null;
    tax_residence_country?: string | Country | null;
    total_assets?: number | null;
    us_links?: boolean | null;
    us_tin?: string | null;
    wealth_tax_liable?: boolean | null;
};

export type Informations = {
    date_created?: string | null;
    date_updated?: string | null;
    description?: string | null;
    id: string;
    name?: string | null;
    sort?: number | null;
    status: string;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
};

export type InvestmentProfile = {
    acceptable_loss?: string | null;
    crypto_risks_acceptance?: boolean | null;
    desired_return?: string | null;
    exclusion_criteria?: string | null;
    id: string;
    investment_horizon?: string | null;
    main_objective?: string | null;
    objective_types?: unknown | null;
    objectives?: string | null;
    risk_appetite?: string | null;
};

export type KnowledgeExperience = {
    crypto_duration?: string | null;
    crypto_frequency?: string | null;
    crypto_holding?: boolean | null;
    crypto_types?: string | null;
    direct_management_experience?: boolean | null;
    id: string;
    monetary_products_duration?: string | null;
    monetary_products_frequency?: string | null;
    monetary_products_holding?: boolean | null;
    portfolio_management_experience?: boolean | null;
    stablecoins_knowledge?: string | null;
    stocks_duration?: string | null;
    stocks_frequency?: string | null;
    stocks_holding?: boolean | null;
    tokens_knowledge?: string | null;
};

export type Languages = {
    code: number;
    direction?: string | null;
    name?: string | null;
    status: string;
};

export type PersonalInformation = {
    address?: string | null;
    birth_date?: string | null;
    city?: string | null;
    country?: string | Country | null;
    function_country?: string | Country | null;
    function_entry_date?: string | null;
    function_exercised?: string | null;
    function_exit_date?: string | null;
    id: string;
    is_pep?: string | null;
    legal_representative?: string | null;
    legal_status?: string | null;
    phone?: string | null;
    postal_code?: string | null;
    protection_regime?: string | null;
    protection_type?: string | null;
    relation_link?: string | null;
    relation_name?: string | null;
};

export type Pipeline = {
    date_created?: string | null;
    date_updated?: string | null;
    icon?: string | null;
    id: string;
    name?: string | null;
    slug?: string | null;
    sort?: number | null;
    status: string;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
};

export type PipelineColumn = {
    event?: string | null;
    event_action?: string | PipelineEvent | null;
    id: string;
    identifier?: string | null;
    name?: string | null;
    pipeline?: string | Pipeline | null;
    users: any[] | DirectusUsers[];
    weight?: number | null;
};

export type PipelineEvent = {
    description?: string | null;
    id: string;
    identifier?: string | null;
    name?: string | null;
    sort?: number | null;
    status: string;
};

export type ProfessionalSituation = {
    activity_sector?: string | null;
    company_name?: string | null;
    country_of_activity?: string | null;
    finance_experience?: boolean | null;
    id: string;
    occupation?: string | null;
    situation_start_date?: string | null;
    status?: string | null;
};

export type Professions = {
    date_created?: string | null;
    description?: string | null;
    id: string;
    name?: string | null;
    risk?: string | Risk | null;
    status: string;
};

export type Representative = {
    cgp?: string | CgpCif | null;
    criminal_record?: string | DirectusFiles | null;
    email?: string | null;
    first_name?: string | null;
    id: string;
    id_card?: string | DirectusFiles | null;
    last_name?: string | null;
    phone?: string | null;
};

export type Risk = {
    countries?: string | Country | null;
    id: string;
    level_of_diligence?: string | null;
    risk_level?: string | null;
    sort?: number | null;
    update?: string | null;
};

export type Society = {
    date_created?: string | null;
    date_updated?: string | null;
    id: string;
    sort?: number | null;
    status: string;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
};

export type SustainablePreferences = {
    esg_preference?: unknown | null;
    extra_financial_priority?: boolean | null;
    id: string;
    impact_details?: string | null;
    impact_selection?: boolean | null;
    sustainability_integration?: boolean | null;
    taxonomy_percentage?: number | null;
};

export type Tasks = {
    assigned_to: any[] | TasksDirectusUsers[];
    date_created?: string | null;
    date_updated?: string | null;
    description?: string | null;
    end_date?: string | null;
    id: string;
    name?: string | null;
    priority?: string | null;
    sort?: number | null;
    start_date?: string | null;
    status: string;
    user_created?: string | DirectusUsers | null;
    user_updated?: string | DirectusUsers | null;
};

export type TasksDirectusUsers = {
    directus_users_id?: string | DirectusUsers | null;
    id: number;
    tasks_id?: string | Tasks | null;
};

export type CustomDirectusTypes = {
    cgp_cif: CgpCif[];
    cgp_cif_association: CgpCifAssociation[];
    cgp_cif_association_representative: CgpCifAssociationRepresentative[];
    cgp_cif_representative: CgpCifRepresentative[];
    client_declarations: ClientDeclarations[];
    client_documents: ClientDocuments[];
    clients: Clients[];
    companies_status: CompaniesStatus[];
    complaint_form: ComplaintForm[];
    complaint_form_directus_users: ComplaintFormDirectusUsers[];
    complaint_form_files: ComplaintFormFiles[];
    country: Country[];
    crypto_analysis: CryptoAnalysis[];
    directus_access: DirectusAccess[];
    directus_activity: DirectusActivity[];
    directus_collections: DirectusCollections[];
    directus_comments: DirectusComments[];
    directus_dashboards: DirectusDashboards[];
    directus_extensions: DirectusExtensions[];
    directus_fields: DirectusFields[];
    directus_files: DirectusFiles[];
    directus_flows: DirectusFlows[];
    directus_folders: DirectusFolders[];
    directus_migrations: DirectusMigrations[];
    directus_notifications: DirectusNotifications[];
    directus_operations: DirectusOperations[];
    directus_panels: DirectusPanels[];
    directus_permissions: DirectusPermissions[];
    directus_policies: DirectusPolicies[];
    directus_presets: DirectusPresets[];
    directus_relations: DirectusRelations[];
    directus_revisions: DirectusRevisions[];
    directus_roles: DirectusRoles[];
    directus_sessions: DirectusSessions[];
    directus_settings: DirectusSettings;
    directus_shares: DirectusShares[];
    directus_translations: DirectusTranslations[];
    directus_users: DirectusUsers[];
    directus_versions: DirectusVersions[];
    directus_webhooks: DirectusWebhooks[];
    family_situation: FamilySituation[];
    financial_groups: FinancialGroups[];
    financial_situation: FinancialSituation[];
    informations: Informations[];
    investment_profile: InvestmentProfile[];
    knowledge_experience: KnowledgeExperience[];
    languages: Languages[];
    personal_information: PersonalInformation[];
    pipeline: Pipeline[];
    pipeline_column: PipelineColumn[];
    pipeline_event: PipelineEvent[];
    professional_situation: ProfessionalSituation[];
    professions: Professions[];
    representative: Representative[];
    risk: Risk[];
    society: Society[];
    sustainable_preferences: SustainablePreferences[];
    tasks: Tasks[];
    tasks_directus_users: TasksDirectusUsers[];
};
