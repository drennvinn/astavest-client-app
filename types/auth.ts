import type { AuthenticationData } from "@directus/sdk";
import type {
    DirectusUsers,
    DirectusRoles,
    Clients,
    CgpCif,
    CgpCifAssociation
} from "./astavest-crm";



export interface DirectusErrorExtensions {
    code: 'INVALID_CREDENTIALS' | 'INVALID_OTP' | 'INVALID_PAYLOAD';
    reason?: string;
}

export interface DirectusError {
    message: string;
    extensions: DirectusErrorExtensions;
}

export interface DirectusErrorResponse {
    errors: DirectusError[];
}

export interface AuthResponse extends AuthenticationData {
    share?: any;
    auth_data?: any;
    auth_expires?: number;
    auth_expires_at?: number;
}

// État du store
export interface AuthState {
    user: DirectusUsers | null;
    userRole: DirectusRoles['slug'] | UserRole;
    userProfile: Clients | CgpCif | CgpCifAssociation | null;
    // isAuthenticated: boolean;
    rememberMe: boolean;
    tfaRequired: boolean;
    isFirstTimeSetup: boolean;
    tfaSecret?: string|null;
    tfaPending: boolean;
    authStep: 'initial' | 'credentials_validated' | 'authenticated';
    tempCredentials: { email: string; password: string; } | null;
}

export enum AuthErrorCode {
    Forbidden = 'FORBIDDEN',
    InvalidCredentials = 'INVALID_CREDENTIALS', // Mot de passe ou email (ou) incorrect
    InvalidOtp = 'INVALID_OTP', // Code de sécurité invalide (2FA)
    InvalidPayload = 'INVALID_PAYLOAD', // Erreur de format de la requête
    InvalidToken = 'INVALID_TOKEN',
    TokenExpired = 'TOKEN_EXPIRED',
    UserSuspended = 'USER_SUSPENDED',
}

export type UserRole = 'client' | 'cgp' | 'cgp_asso';