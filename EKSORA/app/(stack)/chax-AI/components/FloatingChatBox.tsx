// FloatingChatBox.tsx - Enhanced with chat history storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

// Import types
import { ConnectionStatus, FloatingChatBoxProps, Message } from '../types/chat';

// Import components
import { ChatHeader } from './ChatHeader';
import { ChatMessage, TypingIndicator } from './ChatMessage';

// Import services
import { fetchWithRetry, getBaseURL, testConnection } from '../screens/networkService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 🔹 STORAGE KEYS
const STORAGE_KEYS = {
  CHAT_MESSAGES: 'EKSORA_CHAT_MESSAGES',
  LAST_CHAT_TIME: 'EKSORA_LAST_CHAT_TIME',
  CHAT_SESSION_ID: 'EKSORA_CHAT_SESSION_ID'
};

const FloatingChatBox: React.FC<FloatingChatBoxProps> = ({ 
  onClose, 
  onNewMessage, 
  userName 
}) => {
  // State variables
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  
  // User authentication states
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [savingVoucherId, setSavingVoucherId] = useState<string | null>(null);
  
  // 🔹 CHAT HISTORY STATES
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);

  // 🔹 CHAT STORAGE FUNCTIONS
  const generateSessionId = (): string => {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const saveChatHistory = async (messagesToSave: Message[]) => {
    try {
      const chatData = {
        messages: messagesToSave,
        lastSaved: new Date().toISOString(),
        sessionId: sessionId,
        userId: userId
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatData));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_CHAT_TIME, new Date().toISOString());
      
      console.log('💾 Chat history saved:', messagesToSave.length, 'messages');
    } catch (error) {
      console.error('❌ Error saving chat history:', error);
    }
  };

  const loadChatHistory = async (): Promise<Message[]> => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      const lastChatTime = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CHAT_TIME);
      
      if (!savedData || !lastChatTime) {
        console.log('📭 No chat history found');
        return [];
      }

      const chatData = JSON.parse(savedData);
      const lastTime = new Date(lastChatTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);

      // Nếu cuộc trò chuyện cũ hơn 24 giờ thì tạo session mới
      if (hoursDiff > 24) {
        console.log('🕰️ Chat history too old (>24h), starting fresh');
        await clearChatHistory();
        return [];
      }

      // Kiểm tra user có thay đổi không
      if (chatData.userId !== userId && chatData.userId !== null && userId !== null) {
        console.log('👤 Different user detected, starting fresh');
        await clearChatHistory();
        return [];
      }

      // Convert timestamp strings back to Date objects
      const restoredMessages: Message[] = chatData.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      console.log('📜 Chat history loaded:', restoredMessages.length, 'messages');
      setSessionId(chatData.sessionId || generateSessionId());
      
      return restoredMessages;
      
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
      return [];
    }
  };

  const clearChatHistory = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CHAT_MESSAGES,
        STORAGE_KEYS.LAST_CHAT_TIME,
        STORAGE_KEYS.CHAT_SESSION_ID
      ]);
      console.log('🗑️ Chat history cleared');
    } catch (error) {
      console.error('❌ Error clearing chat history:', error);
    }
  };

  // 🔹 ENHANCED: Auto-save messages when they change
  useEffect(() => {
    if (messages.length > 0 && !isLoadingHistory) {
      // Debounce để không save quá nhiều lần
      const timeoutId = setTimeout(() => {
        saveChatHistory(messages);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [messages, isLoadingHistory, sessionId, userId]);

  // Voucher API functions (giữ nguyên)
  const getVouchersFromAPI = async (userId: string | null): Promise<any[]> => {
    try {
      const baseURL = getBaseURL();
      console.log('🎫 Fetching vouchers from:', `${baseURL}/chat-voucher/chat`);
      
      const response = await fetchWithRetry(`${baseURL}/chat-voucher/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'voucher',
          userId: userId
        }),
      });

      console.log('✅ Voucher API response:', response);
      return response.vouchers || [];
      
    } catch (error: any) {
      console.error('⚠️ Error fetching vouchers:', error);
      return [];
    }
  };

  const saveVoucherToAPI = async (userId: string, voucherId: string): Promise<boolean> => {
    try {
      const baseURL = getBaseURL();
      console.log('💾 Saving voucher to:', `${baseURL}/chat-voucher/save-voucher`);
      
      const response = await fetchWithRetry(`${baseURL}/chat-voucher/save-voucher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          voucherId: voucherId
        }),
      });

      console.log('💾 Save voucher response:', response);
      return response.success === true;
      
    } catch (error: any) {
      console.error('⚠️ Error saving voucher:', error);
      throw error;
    }
  };

  // 🔹 ENHANCED: Initialize with history loading
  useEffect(() => {
    console.log('FloatingChatBox mounted');
    
    initializeWithHistory();
    checkConnection();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
      // Auto-save trước khi component unmount
      if (messages.length > 0) {
        saveChatHistory(messages);
      }
    };
  }, []);

  // 🔹 ENHANCED: Initialize user data và load history
  const initializeWithHistory = async () => {
    setIsLoadingHistory(true);
    
    try {
      // Load user data trước
      await initializeUserData();
      
      // Load chat history
      const savedMessages = await loadChatHistory();
      
      if (savedMessages.length > 0) {
        console.log('📜 Restoring chat with', savedMessages.length, 'messages');
        setMessages(savedMessages);
        
        // Scroll to bottom after loading
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      } else {
        // Tạo session mới và welcome message
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        await AsyncStorage.setItem(STORAGE_KEYS.CHAT_SESSION_ID, newSessionId);
        
        // Tạo welcome message dựa trên user status hiện tại
        createWelcomeMessage();
      }
      
    } catch (error) {
      console.error('❌ Error initializing with history:', error);
      createWelcomeMessage();
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Initialize user data from AsyncStorage (giữ nguyên logic cũ)
  const initializeUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('USER_ID');
      const userProfile = await AsyncStorage.getItem('USER_PROFILE');
      const token = await AsyncStorage.getItem('ACCESS_TOKEN');
      
      console.log('🔍 Checking user data:', {
        hasUserId: !!storedUserId,
        hasProfile: !!userProfile,
        hasToken: !!token
      });

      if (storedUserId && token) {
        setUserId(storedUserId);
        setIsLoggedIn(true);
        
        let displayName = '';
        
        if (userProfile) {
          try {
            const user = JSON.parse(userProfile);
            displayName = user.name || user.fullName || user.firstName || user.username ||
                         (user.email ? user.email.split('@')[0] : '');
          } catch (parseError) {
            console.error('⚠️ Error parsing user profile:', parseError);
          }
        }
        
        if (!displayName && userName) {
          displayName = userName;
        }
        
        setUserDisplayName(displayName);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        setUserDisplayName('');
      }
    } catch (error) {
      console.error('⚠️ Error initializing user data:', error);
      setIsLoggedIn(false);
      setUserId(null);
      setUserDisplayName('');
    }
  };

  // 🔹 ENHANCED: Create welcome message với session info
  const createWelcomeMessage = () => {
    let welcomeText = '';
    
    if (isLoggedIn && userDisplayName) {
      const greetings = [
        `Xin chào ${userDisplayName}! Hôm nay tôi có thể giúp gì được cho bạn?`,
        `Chào ${userDisplayName}! Bạn muốn tìm tour nào hôm nay?`,
        `Hi ${userDisplayName}! Tôi có thể hỗ trợ bạn tìm kiếm tour du lịch.`,
        `Xin chào ${userDisplayName}! Bạn có kế hoạch du lịch nào không?`
      ];
      
      welcomeText = greetings[Math.floor(Math.random() * greetings.length)];
    } else {
      welcomeText = 'Xin chào! Tôi có thể giúp gì được cho bạn?';
    }

    const welcomeMessage: Message = {
      id: Date.now(),
      text: welcomeText,
      from: 'bot',
      timestamp: new Date(),
      isRead: true,
    };
    
    setMessages([welcomeMessage]);
  };

  // Check server connection (giữ nguyên)
  const checkConnection = async () => {
    setConnectionStatus('connecting');
    
    try {
      const isConnected = await testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      if (!isConnected) {
        addSystemMessage('⚠️ Kết nối server thất bại. Chế độ offline được kích hoạt.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      addSystemMessage('⚠️ Không thể kết nối đến server. Vui lòng kiểm tra internet.');
    }
  };

  // Add system message
  const addSystemMessage = (text: string) => {
    const systemMessage: Message = {
      id: Date.now(),
      text,
      from: 'bot',
      timestamp: new Date(),
      isRead: true,
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  // 🔹 ENHANCED: Send message với session tracking
const sendMessage = async () => {
    console.log('📤 Sending message:', userInput); // Thêm log để kiểm tra đầu vào
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: userInput.trim(),
      from: 'user',
      timestamp: new Date(),
      isRead: false,
    };

    setMessages(prev => [...prev, userMessage]);
    const originalInput = userInput.trim();
    setUserInput('');
    setIsTyping(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const baseURL = getBaseURL();
      
      // Voucher detection logic (giữ nguyên)
      const isVoucherRequest = /voucher|mã giảm giá|ưu đãi|khuyến mãi|giảm giá|coupon|promotion|discount|deal|offer/i.test(originalInput);
      const isSavedVoucherRequest = /voucher của tôi|mã của tôi|voucher đã lưu|ưu đãi của tôi|voucher tôi có|mã tôi đã lưu|voucher đã có/i.test(originalInput);
      
      let botMessage: Message;
      
      if (isVoucherRequest || isSavedVoucherRequest) {
        console.log('🎫 Detecting voucher request, fetching vouchers...');
        
        const voucherData = await getVouchersFromAPI(userId);
        
        let replyText = '';
        if (isSavedVoucherRequest && !userId) {
          replyText = '🔐 Để xem voucher đã lưu, bạn cần đăng nhập vào tài khoản của mình.';
        } else if (voucherData.length > 0) {
          replyText = isSavedVoucherRequest 
            ? `🎫 Bạn có ${voucherData.length} voucher đã lưu:`
            : `🎉 Có ${voucherData.length} ưu đãi dành cho bạn:`;
        } else {
          replyText = isSavedVoucherRequest
            ? '📋 Bạn chưa lưu voucher nào. Hãy khám phá các ưu đãi có sẵn nhé!'
            : '😔 Hiện tại không có voucher nào khả dụng. Vui lòng quay lại sau!';
        }
        
        botMessage = {
          id: Date.now() + 1,
          text: replyText,
          from: 'bot',
          timestamp: new Date(),
          isRead: false,
          vouchers: voucherData.length > 0 ? voucherData : undefined,
        };
      } else {
        // 🔹 ENHANCED: Normal chat với session ID
        const requestData = { 
          message: originalInput, 
          userId: isLoggedIn ? userId : null,
          sessionId: sessionId // Thêm session tracking
        };

        console.log('📤 Sending chat request:', requestData);

        const data = await fetchWithRetry(`${baseURL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        console.log('📥 Chat response:', data);

        // Xử lý tránh undefined cho botMessage.text
        let botText = (typeof data.reply === 'string' && data.reply.trim() !== '' && data.reply !== 'undefined')
          ? data.reply
          : '';

        botMessage = {
          id: Date.now() + 1,
          text: botText || undefined, // Nếu rỗng thì không truyền text
          from: 'bot',
          timestamp: new Date(),
          isRead: false,
          tours: data.tours || undefined,
          vouchers: data.vouchers || undefined,
        };
      }
      
      setIsTyping(false);
      setConnectionStatus('connected');
      setMessages(prev => [...prev, botMessage]);

      // Mark as read after delay
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === botMessage.id ? { ...msg, isRead: true } : msg
        ));
      }, 2000);

      onNewMessage?.();

    } catch (error) {
      console.error('⚠️ Send message error:', error);
      handleSendError(error, userMessage);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Handle send message errors (giữ nguyên)
  const handleSendError = (error: any, userMessage: Message) => {
    setIsTyping(false);
    setConnectionStatus('disconnected');
    
    let errorText = 'Lỗi không xác định';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorText = 'Timeout - Server không phản hồi trong 10 giây';
      } else if (error.message.includes('Network request failed')) {
        errorText = 'Lỗi mạng - Kiểm tra kết nối internet';
      } else if (error.message.includes('HTTP')) {
        errorText = `Server error: ${error.message}`;
      } else {
        errorText = `Lỗi: ${error.message}`;
      }
    }

    const offlineReply = isLoggedIn && userDisplayName
      ? `🔧 ${errorText}\n\n💡 Phản hồi offline: Cảm ơn ${userDisplayName} đã nhắn "${userMessage.text}". Tôi sẽ trả lời khi kết nối được khôi phục!`
      : `🔧 ${errorText}\n\n💡 Phản hồi offline: Cảm ơn bạn đã nhắn "${userMessage.text}". Tôi sẽ trả lời khi kết nối được khôi phục!`;

    const botMessage: Message = {
      id: Date.now() + 1,
      text: offlineReply,
      from: 'bot',
      timestamp: new Date(),
      isRead: false,
    };

    setMessages(prev => [...prev, botMessage]);
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === botMessage.id ? { ...msg, isRead: true } : msg
      ));
    }, 2000);

    onNewMessage?.();
  };

  // 🔹 ENHANCED: Close chat với option lưu history
  const closeChat = () => {
    Keyboard.dismiss();
    
    // Auto-save trước khi đóng
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
    
    onClose();
  };

  // 🔹 NEW: Clear chat function cho user
  const clearChatConfirm = () => {
    Alert.alert(
      'Xóa cuộc trò chuyện',
      'Bạn có chắc muốn xóa toàn bộ lịch sử trò chuyện? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            await clearChatHistory();
            createWelcomeMessage();
            const newSessionId = generateSessionId();
            setSessionId(newSessionId);
            await AsyncStorage.setItem(STORAGE_KEYS.CHAT_SESSION_ID, newSessionId);
          }
        }
      ]
    );
  };

  // Menu handlers
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const handleClearChatFromMenu = () => {
    closeMenu();
    clearChatConfirm();
  };

  // Voucher handlers (giữ nguyên)
  const handleVoucherPress = (voucher: any) => {
    console.log('Voucher pressed in chat:', voucher);
    
    const discountText = voucher.discountType === 'percentage' 
      ? `${voucher.discount}%` 
      : `${voucher.discount}đ`;
    
    const alertMessage = `
🎫 Mã voucher: ${voucher.code || 'N/A'}
💰 Giảm giá: ${discountText}
📝 ${voucher.description || voucher.title || 'Không có mô tả'}
⏰ HSD: ${voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : 'N/A'}
    `.trim();

    Alert.alert(
      voucher.title || 'Chi tiết Voucher',
      alertMessage,
      [
        {
          text: 'Sao chép mã',
          onPress: () => {
            if (voucher.code) {
              Alert.alert('Đã sao chép', `Mã "${voucher.code}" đã được sao chép!`);
            }
          }
        },
        {
          text: 'Đóng',
          style: 'cancel'
        }
      ]
    );
  };

  const handleLoginRequired = () => {
    Alert.alert(
      'Yêu cầu đăng nhập',
      'Để xem và lưu mã ưu đãi, bạn cần đăng nhập vào tài khoản.',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng nhập', 
          onPress: () => {
            closeChat();
            console.log('🔐 Navigate to login screen');
          }
        }
      ]
    );
  };

  const handleVoucherSave = async (voucher: any) => {
    if (!isLoggedIn || !userId) {
      handleLoginRequired();
      return;
    }

    const voucherId = voucher.id || voucher._id || voucher.voucherId;
    setSavingVoucherId(voucherId);

    try {
      console.log('💾 Saving voucher:', { userId, voucherId });
      
      const success = await saveVoucherToAPI(userId, voucherId);
      
      if (success) {
        Alert.alert('Đã lưu', 'Voucher đã được lưu vào tài khoản của bạn!');
      } else {
        throw new Error('API returned false');
      }
      
    } catch (error) {
      console.error('Error saving voucher:', error);
      Alert.alert('Lỗi', 'Không thể lưu voucher. Vui lòng thử lại.');
    } finally {
      setSavingVoucherId(null);
    }
  };

  // 🔹 ENHANCED: Tour press handler với context preservation
  const handleTourPress = (tour: any) => {
    console.log('🎯 Tour pressed, saving chat context...');
    
    // Lưu chat context trước khi navigate
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
    
    // Delay để ensure save hoàn thành
    setTimeout(() => {
      console.log('🎯 Navigating to tour detail:', tour.id || tour._id);
      // Close chat trước khi navigate để tránh conflict
      closeChat();
    }, 100);
  };

  // Render functions (giữ nguyên)
  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <ChatMessage 
      item={item} 
      index={index} 
      messages={messages}
      onTourPress={handleTourPress} // 🔹 ENHANCED handler
      onVoucherPress={handleVoucherPress}
      onVoucherSave={handleVoucherSave}
      userInfo={{ id: userId, name: userDisplayName }}
      savingVoucherId={savingVoucherId}
      isLoggedIn={isLoggedIn}
      onLoginRequired={handleLoginRequired}
    />
  );

  const renderFooter = () => isTyping ? <TypingIndicator /> : null;

  // Calculate dynamic chat height
  const dynamicChatHeight = keyboardHeight > 0 
    ? screenHeight - keyboardHeight - 50
    : screenHeight * 0.8;

  // 🔹 LOADING STATE
  if (isLoadingHistory) {
    return (
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBackground} onPress={closeChat} />
        <View style={[styles.chatContainer, { height: dynamicChatHeight }]}>
          <ChatHeader
            connectionStatus="connecting"
            onClose={closeChat}
            onRetry={checkConnection}
            userDisplayName={isLoggedIn ? userDisplayName : ''}
            isLoggedIn={isLoggedIn}
          />
          <View style={[styles.messagesContainer, styles.loadingContainer]}>
            <Text style={styles.loadingText}>📜 Đang tải lịch sử trò chuyện...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayBackground} onPress={closeChat} />
      <View style={[styles.chatContainer, { height: dynamicChatHeight }]}>
        {/* Header + nút ba chấm */}
        <View style={styles.headerRow}>
          <ChatHeader
            connectionStatus={connectionStatus}
            onClose={closeChat}
            onRetry={checkConnection}
            userDisplayName={isLoggedIn ? userDisplayName : ''}
            isLoggedIn={isLoggedIn}
          />
          {/* Nút ba chấm dọc nằm bên phải header */}
          <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
            <Text style={styles.menuButtonText}>⋮</Text>
          </TouchableOpacity>
        </View>
        {/* Menu modal nhỏ khi nhấn ba chấm */}
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={closeMenu}
        >
          <TouchableOpacity style={styles.menuOverlay} onPress={closeMenu} />
          <View style={styles.menuPopup}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleClearChatFromMenu}
            >
              <Text style={styles.menuItemText}>Xóa trò chuyện</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* ...existing code... */}
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
          />
          {/* ...existing code... */}
        </View>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'position' : 'height'}
          style={styles.inputContainer}
          keyboardVerticalOffset={0}
        >
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder={isLoggedIn && userDisplayName
                  ? `Aa (${userDisplayName})` 
                  : "Aa"
                }
                value={userInput}
                onChangeText={setUserInput}
                style={styles.textInput}
                multiline
                maxLength={500}
                placeholderTextColor="#65676B"
                onFocus={() => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
              />
            </View>
            {/* Nút gửi luôn ở giữa input, dài hơn khi input nhỏ, cao hơn khi nhiều dòng */}
            <TouchableOpacity
              onPress={sendMessage}
              style={[
                styles.sendButton,
                !userInput.trim() && styles.sendButtonDisabled,
                userInput.split('\n').length > 1
                  ? styles.sendButtonMultiLine
                  : styles.sendButtonSingleLine
              ]}
              disabled={!userInput.trim()}
            >
              <Text style={[
                styles.sendText,
                !userInput.trim() && styles.sendTextDisabled
              ]}>
                ➤
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    flex: 1,
  },
  chatContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    flexDirection: 'column',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  messagesContent: {
    paddingVertical: 8,
    paddingBottom: 10,
  },
  // 🔹 NEW: Loading state styles
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#65676B',
    textAlign: 'center',
  },
  // 🔹 NEW: Chat actions bar styles
  chatActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E4E6EA',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E4E6EA',
    backgroundColor: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 12,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  textInput: {
    fontSize: 15,
    color: '#050505',
    textAlignVertical: 'center',
    minHeight: 20,
  },
  sendButton: {
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0084FF',
    marginLeft: 0,
    marginRight: 0,
    alignSelf: 'center',
  },
  sendButtonSingleLine: {
    width: 56,
    height: 36,
  },
  sendButtonMultiLine: {
    width: 44,
    height: 44,
  },
  sendButtonDisabled: {
    backgroundColor: '#BCC0C4',
  },
  sendText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  sendTextDisabled: {
    color: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingLeft: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
 menuButton: {
    padding: 8,
    marginLeft: 4,
    marginRight: 4,
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    fontSize: 22,
    color: '#65676B',
    fontWeight: 'bold',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuPopup: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minWidth: 140,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
});

export default FloatingChatBox;