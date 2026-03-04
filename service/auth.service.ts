import { apiRequest } from "./api";
import { SignupDTO, LoginDTO, AuthResponse } from "@/types/auth.types";

class AuthService {
    async signup(data: SignupDTO) {

        console.log("UI Data:", data);
        console.log("UI User Data:", data.user); // ✅ if using nested structure

        const response = await apiRequest<AuthResponse>("/users/signup/", {
            method: "POST",
            body: JSON.stringify(data),
        });

        console.log("Signup Full Response:", response);
        console.log("Signup User Data:", response.user);

        return response;
    }

    async login(data: LoginDTO) {

        console.log("Login UI Data:", data);

        const response = await apiRequest<AuthResponse>("/users/login/", {
            method: "POST",
            body: JSON.stringify(data),
        });

        console.log("Login Full Response:", response);
        console.log("Login User Data:", response.user);

        return response;
    }
}

export const authService = new AuthService();