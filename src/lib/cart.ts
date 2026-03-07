export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  artisan?: string;
}

export const cart = {
  getItems: (): CartItem[] => {
    try {
      const cartData = localStorage.getItem('zariya_cart');
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error parsing cart data:', error);
      localStorage.removeItem('zariya_cart');
      return [];
    }
  },
  
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }): void => {
    try {
      const items = cart.getItems();
      const existingIndex = items.findIndex(i => i.productId === item.productId);
      
      if (existingIndex >= 0) {
        items[existingIndex].quantity += item.quantity || 1;
      } else {
        items.push({ ...item, quantity: item.quantity || 1 });
      }
      
      localStorage.setItem('zariya_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  },
  
  removeItem: (productId: string): void => {
    try {
      const items = cart.getItems().filter(i => i.productId !== productId);
      localStorage.setItem('zariya_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  },

  updateQuantity: (productId: string, quantity: number): void => {
    try {
      const items = cart.getItems();
      const itemIndex = items.findIndex(i => i.productId === productId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          items.splice(itemIndex, 1);
        } else {
          items[itemIndex].quantity = quantity;
        }
        localStorage.setItem('zariya_cart', JSON.stringify(items));
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.removeItem('zariya_cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },

  getTotal: (): number => {
    return cart.getItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getItemCount: (): number => {
    return cart.getItems().reduce((count, item) => count + item.quantity, 0);
  }
};