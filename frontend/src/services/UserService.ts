import type { User, LoginCredentials } from '../models/User';

const API_URL = import.meta.env.VITE_AUTH_API_URL;

export class UserService {
  static async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }
    
    return await res.json();
  }
}