import axios from 'axios';

// --- CONFIGURACIÓN ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Importante para CORS según tu backend
});

// --- INTERCEPTOR DE SEGURIDAD ---
// Inyecta el token en cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- TIPOS (Interfaces basadas en tu Mongoose Models) ---
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  cuisine: string;
  rating?: number;
  totalRatings?: number;
  image?: string; // Si decides agregar imágenes luego
}

export interface Review {
  _id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  image?: string;
  createdAt: string;
}

// --- SERVICIOS DE AUTENTICACIÓN (Auth Service) ---
// Rutas: /auth/login, /auth/register

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

export const resetPasswordRequest = async (email: string) => {
  return api.post('/auth/password-reset-request', { email });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// --- SERVICIOS CORE (Huecas & Reseñas) ---
// Rutas: /api/restaurants, /api/reviews

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const response = await api.get<Restaurant[]>('/api/restaurants');
  return response.data;
};

export const getRestaurantById = async (id: string): Promise<Restaurant> => {
  const response = await api.get<Restaurant>(`/api/restaurants/${id}`);
  return response.data;
};

export const createRestaurant = async (data: Partial<Restaurant>) => {
  // Requiere Auth
  const response = await api.post('/api/restaurants', data);
  return response.data;
};

export const deleteRestaurant = async (id: string) => {
  // Requiere Auth
  const response = await api.delete(`/api/restaurants/${id}`);
  return response.data;
};

// --- SERVICIOS DE RESEÑAS Y LIKES ---

export const createReview = async (restaurantId: string, rating: number, comment: string, image?: string) => {
  // Requiere Auth
  const response = await api.post('/api/reviews', { restaurantId, rating, comment, image });
  return response.data;
};

export const getReviewsByRestaurant = async (restaurantId: string): Promise<Review[]> => {
  const response = await api.get<Review[]>(`/api/reviews/${restaurantId}`);
  return response.data;
};

export const toggleLike = async (restaurantId: string) => {
  // Requiere Auth. Devuelve { message: string, liked: boolean }
  const response = await api.post('/api/like', { restaurantId });
  return response.data;
};

export const getLikeStatus = async (restaurantId: string) => {
  // Requiere Auth. Devuelve { liked: boolean }
  const response = await api.get(`/api/likes/${restaurantId}`);
  return response.data;
};

// --- SERVICIO DE CHAT (Historial) ---
// Ruta: /chat/messages

export const getChatHistory = async (room: string = 'general') => {
  const response = await api.get(`/chat/messages?room=${room}`);
  return response.data;
};

export default api;