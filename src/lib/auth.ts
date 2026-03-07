export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'artisan';
  createdAt: string;
}

export const auth = {
  login: (email: string, name: string): User => {
    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role: 'buyer',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('zariya_user', JSON.stringify(user));
    return user;
  },
  
  logout: (): void => {
    localStorage.removeItem('zariya_user');
    localStorage.removeItem('zariya_cart');
    localStorage.removeItem('zariya_favorites');
    localStorage.removeItem('zariya_notifications');
  },
  
  getCurrentUser: (): User | null => {
    try {
      const userData = localStorage.getItem('zariya_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('zariya_user');
      return null;
    }
  },
  
  updateUserRole: (role: 'buyer' | 'artisan'): void => {
    const user = auth.getCurrentUser();
    if (user) {
      user.role = role;
      localStorage.setItem('zariya_user', JSON.stringify(user));
    }
  },

  isAuthenticated: (): boolean => {
    return auth.getCurrentUser() !== null;
  },

  requireAuth: (): User => {
    const user = auth.getCurrentUser();
    if (!user) {
      throw new Error('Authentication required');
    }
    return user;
  }
};