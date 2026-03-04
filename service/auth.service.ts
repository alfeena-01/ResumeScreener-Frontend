import { apiRequest } from "./api";
import { SignupDTO, LoginDTO, AuthResponse } from "@/types/auth.types";

class AuthService {
    signup(data: SignupDTO) {
        return apiRequest<AuthResponse>("/users/signup/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    login(data: LoginDTO) {
        return apiRequest<AuthResponse>("/users/login/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
}

export const authService = new AuthService();