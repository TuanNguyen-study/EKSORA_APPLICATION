// types/chat.ts - Extended version with all types
export interface Message {
  id: number;
  text: string;
  from: 'user' | 'bot';
  timestamp: Date;
  isRead?: boolean;
  tours?: Tour[];
  vouchers?: Voucher[];
}

export interface Tour {
  id: string;
  _id?: string;
  name: string;
  title?: string;
  price: string;
  adultPrice?: string;
  priceChild?: string;
  image: string;
  imageUrl?: string;
  rating: number;
  location: string;
  maxTickets: string;
  duration?: string;
  openingTime?: string;
  closingTime?: string;
  description?: string;
  cateID?: {
    _id: string;
    name: string;
  };
  status?: string;
}

export interface Voucher {
  id: string;
  _id?: string;
  code: string;
  title: string;
  name?: string;
  description?: string;
  discount: number | string;
  discountType: 'percentage' | 'fixed';
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate?: string | Date;
  usageLimit?: number;
  usageCount?: number;
  isActive?: boolean;
  applicableTours?: string[];
  userSpecific?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface FloatingChatBoxProps {
  onClose: () => void;
  onNewMessage?: () => void;
  userName?: string;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

// ✨ NEW: Additional types for enhanced chat functionality

/**
 * Chat session stored in AsyncStorage
 */
export interface ChatSession {
  id: string;
  userId: string | null;
  messages: Message[];
  lastActivity: Date;
  createdAt: Date;
  userInfo?: {
    name: string;
    email?: string;
    avatar?: string;
  };
}

/**
 * Chat statistics for analytics
 */
export interface ChatStats {
  totalMessages: number;
  userMessages: number;
  botMessages: number;
  sessionsCount: number;
  lastActivity: Date | null;
  averageMessagesPerSession: number;
  tourRecommendations: number;
  voucherShares: number;
}

/**
 * Chat export format
 */
export interface ChatExportData {
  userId: string;
  exportDate: string;
  messagesCount: number;
  messages: ExportedMessage[];
  userInfo?: {
    name?: string;
    email?: string;
  };
}

/**
 * Simplified message format for export
 */
export interface ExportedMessage {
  text: string;
  from: 'user' | 'bot';
  timestamp: string;
  hasTours: boolean;
  hasVouchers: boolean;
  tourCount?: number;
  voucherCount?: number;
}

/**
 * Chat configuration options
 */
export interface ChatConfig {
  maxStoredMessages: number;
  maxStoredSessions: number;
  sessionExpiryDays: number;
  autoSaveEnabled: boolean;
  notificationsEnabled: boolean;
  debugMode: boolean;
}

/**
 * Chat event types for analytics
 */
export type ChatEventType = 
  | 'message_sent'
  | 'message_received' 
  | 'tour_clicked'
  | 'voucher_clicked'
  | 'voucher_saved'
  | 'chat_opened'
  | 'chat_closed'
  | 'history_cleared'
  | 'error_occurred';

/**
 * Chat event data structure
 */
export interface ChatEvent {
  type: ChatEventType;
  timestamp: Date;
  userId?: string | null;
  sessionId: string;
  data?: {
    messageLength?: number;
    tourId?: string;
    voucherId?: string;
    errorMessage?: string;
    [key: string]: any;
  };
}

/**
 * Notification settings for chat
 */
export interface ChatNotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  showPreview: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string;   // "08:00"
}

/**
 * Chat user preferences
 */
export interface ChatUserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  language: 'vi' | 'en';
  notifications: ChatNotificationSettings;
  autoScroll: boolean;
  showTimestamps: boolean;
  showReadStatus: boolean;
  saveHistory: boolean;
}

/**
 * Server response for chat API
 */
export interface ChatApiResponse {
  success: boolean;
  reply?: string;
  tours?: Tour[];
  vouchers?: Voucher[];
  metadata?: {
    responseTime: number;
    confidence: number;
    intent?: string;
    entities?: Record<string, any>;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Chat request payload
 */
export interface ChatApiRequest {
  message: string;
  userId?: string | null;
  sessionId?: string;
  context?: {
    previousIntent?: string;
    userPreferences?: Partial<ChatUserPreferences>;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
  };
  metadata?: {
    platform: 'ios' | 'android' | 'web';
    appVersion: string;
    timestamp: string;
  };
}

/**
 * Network service response wrapper
 */
export interface NetworkResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    processingTime: number;
  };
}

/**
 * Chat storage service options
 */
export interface ChatStorageOptions {
  enableCompression: boolean;
  encryptData: boolean;
  autoCleanup: boolean;
  backupToCloud: boolean;
  syncAcrossDevices: boolean;
}

/**
 * Position for floating chat button
 */
export interface ChatButtonPosition {
  x: number;
  y: number;
}

/**
 * Chat UI state
 */
export interface ChatUIState {
  isVisible: boolean;
  isTyping: boolean;
  isDragging: boolean;
  hasNewMessage: boolean;
  keyboardHeight: number;
  scrollPosition: number;
  selectedMessages: number[];
}

/**
 * Tour interaction tracking
 */
export interface TourInteraction {
  tourId: string;
  tourName: string;
  action: 'view' | 'click' | 'bookmark' | 'share';
  timestamp: Date;
  sessionId: string;
  userId?: string | null;
  context: {
    fromChat: boolean;
    searchQuery?: string;
    messageId?: number;
  };
}

/**
 * Voucher interaction tracking
 */
export interface VoucherInteraction {
  voucherId: string;
  voucherCode: string;
  action: 'view' | 'save' | 'copy' | 'use';
  timestamp: Date;
  sessionId: string;
  userId?: string | null;
  context: {
    fromChat: boolean;
    messageId?: number;
    tourContext?: string;
  };
}

// ✨ Type guards for runtime type checking

export const isMessage = (obj: any): obj is Message => {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.text === 'string' &&
    (obj.from === 'user' || obj.from === 'bot') &&
    obj.timestamp instanceof Date
  );
};

export const isTour = (obj: any): obj is Tour => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'string' &&
    typeof obj.image === 'string' &&
    typeof obj.rating === 'number' &&
    typeof obj.location === 'string'
  );
};

export const isVoucher = (obj: any): obj is Voucher => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.code === 'string' &&
    typeof obj.title === 'string' &&
    (typeof obj.discount === 'number' || typeof obj.discount === 'string') &&
    (obj.discountType === 'percentage' || obj.discountType === 'fixed')
  );
};

// ✨ Utility types for common operations

export type MessageWithoutTimestamp = Omit<Message, 'timestamp'> & {
  timestamp: string;
};

export type TourSummary = Pick<Tour, 'id' | 'name' | 'price' | 'image' | 'rating' | 'location'>;

export type VoucherSummary = Pick<Voucher, 'id' | 'code' | 'title' | 'discount' | 'discountType' | 'expiryDate'>;

// ✨ Constants for type safety
export const CHAT_CONFIG: ChatConfig = {
  maxStoredMessages: 100,
  maxStoredSessions: 10,
  sessionExpiryDays: 30,
  autoSaveEnabled: true,
  notificationsEnabled: true,
  debugMode: __DEV__,
};

export const DEFAULT_CHAT_PREFERENCES: ChatUserPreferences = {
  theme: 'light',
  fontSize: 'medium',
  language: 'vi',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    showPreview: true,
    quietHoursEnabled: false,
  },
  autoScroll: true,
  showTimestamps: true,
  showReadStatus: true,
  saveHistory: true,
};