import { apiRequest } from "./api";
import { SignupDTO, LoginDTO, AuthResponse } from "@/types/auth.types";

class AuthService {
    async signup(data: SignupDTO) {

        console.log("UI Data:", data);
        console.log("UI User Data:", data.user); // ✅ if using nested structure

        // Flatten the nested user data to match backend expectations
        const flattenedData = {
            email: data.user.email,
            username: data.user.username,
            password: data.user.password,
            password_confirm: data.user.password_confirm,
            user_type: data.user.user_type,
        };

        const response = await apiRequest<AuthResponse>("/users/signup/", {
            method: "POST",
            body: JSON.stringify(flattenedData),
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