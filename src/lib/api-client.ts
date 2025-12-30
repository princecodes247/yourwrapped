export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new ApiError(response.status, error.message || response.statusText);
    }
    return response.json();
}

export const apiClient = {
    get: async <T>(endpoint: string, headers: HeadersInit = {}): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include',
        });
        return handleResponse<T>(response);
    },

    post: async <T>(endpoint: string, body: unknown, headers: HeadersInit = {}): Promise<T> => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });
        return handleResponse<T>(response);
    },
};
