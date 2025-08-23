const API_CONFIG = {
  // Local development
  LOCAL_URL: 'http://10.36.129.180:3000',
  
  // Production/Network
  PROD_URL: 'http://160.250.246.76:3000',
  
  // Determine which to use
  BASE_URL: __DEV__ 
    ? 'http://10.36.129.180:3000'  // Development
    : 'http://160.250.246.76:3000' // Production
};

export const CHAT_API_URL = `${API_CONFIG.BASE_URL}/chat`;