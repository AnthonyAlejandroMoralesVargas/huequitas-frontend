export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category: 'Típica' | 'Callejera' | 'Mariscos' | 'Postres';
  image: string;
  rating: number;
  latestReview: string;
  reviewCount: number;
}

export interface Review {
  id: string;
  restaurantId: string;
  restaurantName: string;
  text: string;
  rating: number;
  photo?: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}
