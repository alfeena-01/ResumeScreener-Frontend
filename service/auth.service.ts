import { apiRequest } from "./api";
import { SignupDTO, LoginDTO, AuthResponse } from "@/types/auth.types";

class AuthService {
    async signup(data: SignupDTO) {
        const response = await apiRequest<AuthResponse>("/users/signup/", {
            method: "POST",
            body: JSON.stringify(data),
        });

        // ✅ Now response exists
        console.log("Signup Full Response:", response);
        console.log("Signup User Data:", response.user);

        return response;
    }

    async login(data: LoginDTO) {
        const response = await apiRequest<AuthResponse>("/users/login/", {
            method: "POST",
            body: JSON.stringify(data),
        });

        // ✅ Now response exists
        console.log("Login Full Response:", response);
        console.log("Login User Data:", response.user);

        return response;
    }
}

export const authService = new AuthService();