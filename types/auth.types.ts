export interface SignupDTO {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    user_type: "job_seeker" | "hr";
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface User {
    id: number | string;
    username: string;
    email: string;
    user_type: "job_seeker" | "hr";
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: User;
    message?: string;
}