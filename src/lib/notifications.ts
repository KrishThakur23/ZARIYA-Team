export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'artisan_joined' | 'price_drop' | 'order_update' | 'general';
}

export const notifications = {
  getItems: (): Notification[] => {
    try {
      const notifData = localStorage.getItem('zariya_notifications');
      return notifData ? JSON.parse(notifData) : [];
    } catch (error) {
      console.error('Error parsing notifications data:', error);
      localStorage.removeItem('zariya_notifications');
      return [];
    }
  },
  
  addItem: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void => {
    try {
      const items = notifications.getItems();
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        read: false
      };
      items.unshift(newNotification); // Add to beginning
      localStorage.setItem('zariya_notifications', JSON.stringify(items));
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  },
  
  markAsRead: (id: string): void => {
    try {
      const items = notifications.getItems();
      const itemIndex = items.findIndex(i => i.id === id);
      
      if (itemIndex >= 0) {
        items[itemIndex].read = true;
        localStorage.setItem('zariya_notifications', JSON.stringify(items));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: (): void => {
    try {
      const items = notifications.getItems().map(item => ({ ...item, read: true }));
      localStorage.setItem('zariya_notifications', JSON.stringify(items));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.removeItem('zariya_notifications');
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  },

  getUnreadCount: (): number => {
    return notifications.getItems().filter(item => !item.read).length;
  },

  // Initialize with sample notifications for demo
  initializeSampleNotifications: (): void => {
    const existing = notifications.getItems();
    if (existing.length === 0) {
      const sampleNotifications = [
        {
          title: 'Welcome to Zariya!',
          message: 'Discover authentic handcrafted treasures from talented artisans.',
          type: 'general' as const
        },
        {
          title: 'New Artisan Joined',
          message: 'Maria Santos from Jaipur has joined our marketplace with beautiful pottery.',
          type: 'artisan_joined' as const
        },
        {
          title: 'Price Drop Alert',
          message: 'The Handwoven Silk Saree you liked is now 15% off!',
          type: 'price_drop' as const
        }
      ];

      sampleNotifications.forEach(notif => notifications.addItem(notif));
    }
  }
};