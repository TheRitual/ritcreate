import axios from "axios";
import type {
  Product,
  FilterOptions,
  LoginRequest,
  AuthResponse,
  User,
} from "../types";

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function transformProduct(raw: Product & { _id?: string }): Product {
  return {
    ...raw,
    id: raw.id ?? raw._id?.toString() ?? "",
  };
}

export const productApi = {
  getAll: async (filters?: FilterOptions): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.spiceLevel !== undefined)
      params.append("spiceLevel", String(filters.spiceLevel));
    if (filters?.search) params.append("search", filters.search);
    const res = await api.get<Product[]>(`/products?${params.toString()}`);
    return Array.isArray(res.data) ? res.data.map(transformProduct) : [];
  },
  getById: async (id: string): Promise<Product> => {
    const res = await api.get<Product>(`/products/${id}`);
    return transformProduct(res.data);
  },
};

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", credentials);
    return res.data;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
  getProfile: async (): Promise<User> => {
    const res = await api.get<User>("/auth/profile");
    return res.data;
  },
};
