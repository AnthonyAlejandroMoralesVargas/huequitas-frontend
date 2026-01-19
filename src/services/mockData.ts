import { Restaurant, Review, ChatMessage, User, AuthResponse } from '../types';

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'El Rincón de la Abuela',
    category: 'Soups',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    latestReview: 'La mejor sopa de mondongo que he probado. El sabor es auténtico y casero.',
    reviewCount: 127,
  },
  {
    id: '2',
    name: 'La Casa del Sancocho',
    category: 'Soups',
    image: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    latestReview: 'El sancocho tiene ese toque especial que te hace sentir en casa. Delicioso!',
    reviewCount: 94,
  },
  {
    id: '3',
    name: 'Bandeja Paisa Express',
    category: 'Main',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    latestReview: 'La bandeja paisa más completa y sabrosa. Porciones generosas y precio justo.',
    reviewCount: 203,
  },
  {
    id: '4',
    name: 'Ajiaco Santafereño',
    category: 'Soups',
    image: 'https://images.pexels.com/photos/1410236/pexels-photo-1410236.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    latestReview: 'El ajiaco es espectacular. Las papas están en su punto y el guascas le da ese sabor único.',
    reviewCount: 156,
  },
  {
    id: '5',
    name: 'La Lechonería',
    category: 'Main',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    latestReview: 'El lechón está crujiente por fuera y jugoso por dentro. Perfecto con arepa y ají.',
    reviewCount: 88,
  },
  {
    id: '6',
    name: 'Dulces de la Abuela',
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    latestReview: 'El postre de tres leches es divino. No muy dulce y súper cremoso.',
    reviewCount: 142,
  },
  {
    id: '7',
    name: 'Arequipe & Café',
    category: 'Desserts',
    image: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    latestReview: 'Los obleas con arequipe son increíbles. El café es de calidad y muy aromático.',
    reviewCount: 76,
  },
  {
    id: '8',
    name: 'El Fogón Llanero',
    category: 'Main',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    latestReview: 'La mamona es auténtica. Te transporta a los llanos orientales con cada bocado.',
    reviewCount: 112,
  },
];

const mockUsers: User[] = [
  { id: '1', name: 'Carlos Mendoza', email: 'carlos@example.com' },
  { id: '2', name: 'María López', email: 'maria@example.com' },
  { id: '3', name: 'Juan Pérez', email: 'juan@example.com' },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '2',
    userName: 'María López',
    message: 'Hola! Alguien ha probado el nuevo restaurante en el centro?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    userId: '3',
    userName: 'Juan Pérez',
    message: 'Sí! Yo fui ayer. El sancocho es espectacular!',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: '3',
    userId: '1',
    userName: 'Carlos Mendoza',
    message: 'Tengo que ir entonces. Gracias por la recomendación!',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const mockApi = {
  login: (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const user = mockUsers[0];
          resolve({
            token: 'mock-jwt-token-' + Date.now(),
            user,
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  },

  signUp: (name: string, email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: String(mockUsers.length + 1),
          name,
          email,
        };
        resolve({
          token: 'mock-jwt-token-' + Date.now(),
          user: newUser,
        });
      }, 1000);
    });
  },

  getRestaurants: (): Promise<Restaurant[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRestaurants);
      }, 600);
    });
  },

  searchRestaurants: (query: string, category?: string): Promise<Restaurant[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = mockRestaurants;
        
        if (category && category !== 'All') {
          filtered = filtered.filter(r => r.category === category);
        }
        
        if (query) {
          filtered = filtered.filter(r => 
            r.name.toLowerCase().includes(query.toLowerCase())
          );
        }
        
        resolve(filtered);
      }, 400);
    });
  },

  createReview: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt'>): Promise<Review> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview: Review = {
          ...review,
          id: String(Date.now()),
          userId: '1',
          userName: 'Carlos Mendoza',
          createdAt: new Date().toISOString(),
        };
        resolve(newReview);
      }, 700);
    });
  },

  getMessages: (): Promise<ChatMessage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMessages);
      }, 500);
    });
  },

  sendMessage: (message: string): Promise<ChatMessage> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMessage: ChatMessage = {
          id: String(Date.now()),
          userId: '1',
          userName: 'Carlos Mendoza',
          message,
          timestamp: new Date().toISOString(),
        };
        mockMessages.push(newMessage);
        resolve(newMessage);
      }, 300);
    });
  },

  getTopRated: (): Promise<Restaurant[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sorted = [...mockRestaurants].sort((a, b) => b.rating - a.rating);
        resolve(sorted);
      }, 500);
    });
  },
};
