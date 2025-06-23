import { User } from "../models/user.model";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
  mobile: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}