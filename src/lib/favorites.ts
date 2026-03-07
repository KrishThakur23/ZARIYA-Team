export interface FavoriteItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  artisan?: string;
  addedAt: string;
}

export const favorites = {
  getItems: (): FavoriteItem[] => {
    try {
      const favData = localStorage.getItem('zariya_favorites');
      return favData ? JSON.parse(favData) : [];
    } catch (error) {
      console.error('Error parsing favorites data:', error);
      localStorage.removeItem('zariya_favorites');
      return [];
    }
  },
  
  addItem: (item: Omit<FavoriteItem, 'addedAt'>): void => {
    try {
      const items = favorites.getItems();
      if (!items.find(i => i.productId === item.productId)) {
        const newItem: FavoriteItem = {
          ...item,
          addedAt: new Date().toISOString()
        };
        items.push(newItem);
        localStorage.setItem('zariya_favorites', JSON.stringify(items));
      }
    } catch (error) {
      console.error('Error adding item to favorites:', error);
    }
  },
  
  removeItem: (productId: string): void => {
    try {
      const items = favorites.getItems().filter(i => i.productId !== productId);
      localStorage.setItem('zariya_favorites', JSON.stringify(items));
    } catch (error) {
      console.error('Error removing item from favorites:', error);
    }
  },
  
  toggleItem: (item: Omit<FavoriteItem, 'addedAt'>): boolean => {
    try {
      const items = favorites.getItems();
      const existingIndex = items.findIndex(i => i.productId === item.productId);
      
      if (existingIndex >= 0) {
        items.splice(existingIndex, 1);
        localStorage.setItem('zariya_favorites', JSON.stringify(items));
        return false; // Removed
      } else {
        const newItem: FavoriteItem = {
          ...item,
          addedAt: new Date().toISOString()
        };
        items.push(newItem);
        localStorage.setItem('zariya_favorites', JSON.stringify(items));
        return true; // Added
      }
    } catch (error) {
      console.error('Error toggling favorite item:', error);
      return false;
    }
  },

  isFavorite: (productId: string): boolean => {
    return favorites.getItems().some(item => item.productId === productId);
  },

  getCount: (): number => {
    return favorites.getItems().length;
  }
};