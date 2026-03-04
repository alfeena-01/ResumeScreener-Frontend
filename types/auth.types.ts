export interface SignupDTO {
    user: {
        username: string;
        email: string;
        password: string;
        password_confirm: string;
        user_type: string;
    };
}

export interface LoginDTO {
    user: {
        email: string;
        password: string;
    };
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: {
        id: number | string;
        username: string;
        email: string;
        user_type: string;
    };
}