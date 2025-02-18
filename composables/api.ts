import { ref } from 'vue'


interface FetchState {
    data: any,
    isLoading: boolean,
    error: any
}


function buildQuery(params: Record<string, string | string[]>) {
    const searchParams = new URLSearchParams();
    for (const key in params) {
        const value = params[key];
        if (Array.isArray(value)) {
            value.forEach(val => searchParams.append(key, val));
        } else {
            searchParams.append(key, value);
        }
    }
    return searchParams.toString();
}

const useFetch = (url: string, queryParams?: Record<string, string | string[]>) => {
    const data = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    const doFetch = async (options?: RequestInit): Promise<FetchState> => {
        isLoading.value = true
        error.value = null
        try {
            let fullUrl = url;
            if (queryParams) {
                fullUrl = `${url}?${buildQuery(queryParams)}`
            }
            const response = await fetch(fullUrl, options)
            if (!response.ok) {
                throw new Error('An error occurred while fetching the data.')
            }
            data.value = await response.json()
        } catch (err: any) {
            error.value = err.message
        } finally {
            isLoading.value = false
        }
        return { data: data.value, isLoading: isLoading.value, error: error.value };
    }

    return {
        data,
        isLoading,
        error,
        doFetch
    } as const
}


const getFullUrl = (url: string) => {
    const runtimeConfig = useRuntimeConfig();
    const directusUrl = runtimeConfig.public.directusUrl;
    return url.startsWith('http') ? url : `${directusUrl}${url}`;
}


const get = (url: string = '', options?: RequestInit, queryParams?: Record<string, string | string[]>) => {
    const fullUrl = getFullUrl(url);
    options = {
        ...options,
        method: 'GET'
    };
    return useFetch(fullUrl, queryParams).doFetch(options);
}

const post = (url: string = '', body: any, options?: RequestInit, queryParams?: Record<string, string | string[]>) => {
    const fullUrl = getFullUrl(url);
    const defaultHeaders = { 'Content-Type': 'application/json' };
    options = {
        ...options,
        method: 'POST',
        headers: { ...defaultHeaders, ...(options?.headers || {}) }
    }
    if (body !== undefined && body !== null) { options.body = JSON.stringify(body) }
    return useFetch(fullUrl, queryParams).doFetch(options)
}

const patch = (url: string = '', body: any, options?: RequestInit, queryParams?: Record<string, string | string[]>) => {
    const fullUrl = getFullUrl(url);
    const defaultHeaders = { 'Content-Type': 'application/json' };
    options = {
        ...options,
        method: 'PATCH',
        headers: { ...defaultHeaders, ...(options?.headers || {}) }
    }
    if (body !== undefined && body !== null) { options.body = JSON.stringify(body) }
    return useFetch(fullUrl, queryParams).doFetch(options)
}

const put = (url: string = '', body: any, options?: RequestInit, queryParams?: Record<string, string | string[]>) => {
    const fullUrl = getFullUrl(url);
    const defaultHeaders = { 'Content-Type': 'application/json' };
    options = {
        ...options,
        method: 'PUT',
        headers: { ...defaultHeaders, ...(options?.headers || {}) }
    }
    if (body !== undefined && body !== null) { options.body = JSON.stringify(body) }
    return useFetch(fullUrl, queryParams).doFetch(options)
}

const del = (url: string = '', options?: RequestInit, queryParams?: Record<string, string | string[]>) => {
    const fullUrl = getFullUrl(url)
    options = {
        ...options,
        method: 'DELETE'
    }
    return useFetch(fullUrl, queryParams).doFetch(options)
}



const api = { get, post, patch, put, del }
export default api;
