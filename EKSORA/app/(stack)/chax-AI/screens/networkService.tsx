// services/networkService.ts
import { Platform } from 'react-native';
// import NetInfo from '@react-native-community/netinfo'; // Comment nếu chưa cài

// Danh sách các IP có thể để thử kết nối
const POSSIBLE_IPS = [
  // IPs từ mạng LAN hiện tại (172.16.x.x)
  '172.16.97.93',   // IP máy bạn
  '172.16.64.1',    // Có thể là gateway/router
  '172.16.64.166',  // IP từ ARP table
  '172.16.96.14',   // IP từ ARP table
  '172.16.96.139',  // IP từ ARP table
  '172.16.96.160',  // IP từ ARP table
  '172.16.97.37',   // IP từ ARP table
  
  // IPs cũ từ cấu hình trước
  '10.135.221.180', // IP từ ARP table
  '10.50.85.180',   // IP hiện tại
  '10.36.129.180',  // IP từ server log
  
  // Fallback IPs
  'localhost',      // Fallback cho iOS simulator
  '127.0.0.1',      // Localhost
  '192.168.1.100',  // Common local IP range
  '192.168.1.1',    // Common router IP
];

let cachedBaseURL: string | null = null;

export const getBaseURL = (): string => {
  if (cachedBaseURL) {
    return cachedBaseURL;
  }

  if (__DEV__) {
    if (Platform.OS === 'ios') {
      return 'http://localhost:3000';
    } else {
      // Sử dụng IP đầu tiên trong danh sách cho Android
      return `http://${POSSIBLE_IPS[0]}:3000`;
    }
  }
  return 'https://your-production-url.com';
};

export const fetchWithRetry = async (
  url: string, 
  options: RequestInit, 
  maxRetries = 3
): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Tăng timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`Attempt ${i + 1} failed:`, errorMessage);
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

export const testConnection = async (): Promise<boolean> => {
  // Kiểm tra kết nối mạng trước (comment nếu chưa cài NetInfo)
  // const netInfo = await NetInfo.fetch();
  // if (!netInfo.isConnected) {
  //   console.log('No internet connection');
  //   return false;
  // }

  // Nếu đã có cached URL, thử nó trước
  if (cachedBaseURL) {
    try {
      const response = await fetchWithRetry(`${cachedBaseURL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }, 1);
      
      console.log('✅ Cached URL works:', cachedBaseURL);
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('❌ Cached URL failed, trying alternatives...', errorMessage);
      cachedBaseURL = null;
    }
  }

  // Thử từng IP trong danh sách
  for (const ip of POSSIBLE_IPS) {
    try {
      const baseURL = ip.includes('://') ? ip : `http://${ip}:3000`;
      console.log(`🔄 Testing connection to: ${baseURL}`);
      
      const response = await fetchWithRetry(`${baseURL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }, 2);

      console.log('✅ Connection successful:', baseURL);
      console.log('Health check response:', response);
      
      // Cache URL thành công
      cachedBaseURL = baseURL;
      return true;
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ Failed to connect to ${ip}:`, errorMessage);
      continue;
    }
  }

  console.error('❌ All connection attempts failed');
  return false;
};

// Hàm để test kết nối với một IP cụ thể
export const testSpecificIP = async (ip: string, port: number = 3000): Promise<boolean> => {
  try {
    const baseURL = `http://${ip}:${port}`;
    console.log(`🔄 Testing specific IP: ${baseURL}`);
    
    const response = await fetchWithRetry(`${baseURL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, 1);

    console.log('✅ Specific IP connection successful:', baseURL);
    cachedBaseURL = baseURL;
    return true;
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Failed to connect to ${ip}:${port}:`, errorMessage);
    return false;
  }
};

// Hàm để test tất cả IPs trong mạng LAN 172.16.x.x
export const testLANRange = async (baseIP: string = '172.16', portRange: number[] = [3000, 8080, 5000]): Promise<string[]> => {
  const workingIPs: string[] = [];
  const commonLastOctets = [1, 10, 100, 180, 200]; // Common server IPs
  
  for (let third = 64; third <= 127; third++) {
    for (const last of commonLastOctets) {
      for (const port of portRange) {
        const ip = `${baseIP}.${third}.${last}`;
        try {
          const isWorking = await testSpecificIP(ip, port);
          if (isWorking) {
            workingIPs.push(`${ip}:${port}`);
            console.log(`✅ Found working server: ${ip}:${port}`);
          }
        } catch (error) {
          // Silent fail, chỉ log working IPs
        }
      }
    }
  }
  
  console.log('🔍 LAN scan completed. Working servers:', workingIPs);
  return workingIPs;
};

// Hàm để reset cached URL và thử lại
export const resetConnection = () => {
  cachedBaseURL = null;
  console.log('🔄 Connection cache reset');
};

// Hàm để lấy thông tin mạng hiện tại
export const getNetworkInfo = async () => {
  try {
    // const netInfo = await NetInfo.fetch(); // Uncomment nếu đã cài NetInfo
    // return {
    //   isConnected: netInfo.isConnected,
    //   type: netInfo.type,
    //   details: netInfo.details,
    // };
    return { isConnected: true, type: 'wifi', details: null }; // Mock data
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to get network info:', errorMessage);
    return null;
  }
};