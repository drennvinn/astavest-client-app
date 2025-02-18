
// export const v_required = (value: any) => !!value;
export const v_required = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return !!value;
};


export const v_requiredIf = (condition: () => boolean) => (value: any) => !condition() || !!value;


// export const v_minLength = (min: number) => (value: string) => !value || value.length >= min;
export const v_minLength = (min: number) => (value: string): boolean => {
    if (!value) return false;
    return value.length >= min;
};


export const v_maxLength = (max: number) => (value: string) => !value || value.length <= max;


// export const v_email = (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const v_email = (value: string): boolean => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};


export const v_sameAs = (otherValue: any) => (value: any) => value === otherValue;


export const v_isAdult = (date: string): boolean => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }

    return age >= 18;
};


export const v_isValidPhone = (phone: string): boolean => {
    return /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(phone);
};


export const v_isValidPostalCode = (code: string): boolean => {
    return /^\d{5}$/.test(code);
};


export const v_isValidDate = (date: string): boolean => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
};



/**
 * Vérifie si la valeur est un nombre positif valide
 * Accepte les nombres et les strings numériques
 */
export const v_isPositiveNumber = (value: number | string | null | undefined): boolean => {
    if (value === null || value === undefined || value === '') {
        return false;
    }
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(numValue) && numValue >= 0;
};


/**
 * Vérifie si la valeur est un nombre entre min et max inclus
 * Accepte les nombres et les strings numériques
 */
export const v_isNumberInRange = (
    value: number | string | null | undefined,
    min: number,
    max: number
): boolean => {
    if (!v_isPositiveNumber(value)) {
        return false;
    }
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue >= min && numValue <= max;
};