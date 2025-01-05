export const keys = {
  IS_LOGGED_IN: 'IS_LOGGED_IN',
  USER: 'USER',
  RECENT_SEGMENTS: 'RECENT_SEGMENTS',
  FAVORITE_SEGMENTS: 'FAVORITE_SEGMENTS',
};

export const storage = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem: (key: string, value: any): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const serializedValue = JSON.stringify(value);
        window.localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  },

  getItem: <T>(key: string): T | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Error retrieving from localStorage:', error);
      }
    }
    return null;
  },

  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  },

  clear: (): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  },

  hasItem: (key: string): boolean => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key) !== null;
      } catch (error) {
        console.error('Error checking localStorage item:', error);
      }
    }
    return false;
  },
};
