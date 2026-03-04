import API_BASE_URL from "@/config/env";

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!response.ok) {
        let error;
        try {
            // First check if it's actually JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                error = await response.json();
            } else {
                const textError = await response.text();
                throw new Error(textError || `HTTP error ${response.status}`);
            }
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Unknown error";
            throw new Error(`Server returned ${response.status}: ${msg}`);
        }

        let errorMessage = "Something went wrong";
        if (error?.message) {
            errorMessage = error.message;
        } else if (error?.detail) {
            errorMessage = error.detail;
        } else if (error && typeof error === "object") {
            const firstKey = Object.keys(error)[0];
            if (firstKey && Array.isArray(error[firstKey])) {
                errorMessage = `${firstKey}: ${error[firstKey][0]}`;
            } else if (firstKey && typeof error[firstKey] === "string") {
                errorMessage = error[firstKey];
            }
        }

        throw new Error(errorMessage);
    }

    return response.json();
}