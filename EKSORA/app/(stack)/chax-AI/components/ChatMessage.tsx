// components/ChatMessage.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Message } from '../types/chat';
import TourCards from '../components/TourCards';
import VoucherCards from '../components/VoucherCards';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface ChatMessageProps {
  item: Message;
  index: number;
  messages: Message[];
  onTourPress?: (tour: any) => void;
  onVoucherPress?: (voucher: any) => void;
  onVoucherSave?: (voucher: any) => Promise<void>;
  userInfo?: any;
  savingVoucherId?: string | null;
  isLoggedIn?: boolean; // ✨ NEW: Add login status
  onLoginRequired?: () => void; // ✨ NEW: Add login callback
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  item,
  index,
  messages,
  onTourPress,
  onVoucherPress,
  onVoucherSave,
  userInfo,
  savingVoucherId,
  isLoggedIn = false, // ✨ NEW: Default to false
  onLoginRequired // ✨ NEW: Login callback
}) => {
  const router = useRouter();
  const isUser = item.from === 'user';
  const showAvatar = !isUser && (index === messages.length - 1 || messages[index + 1]?.from !== 'bot');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Handle tour press with auto-close logic
  const handleTourPress = (tour: any) => {
    console.log('🎯 Tour pressed in ChatMessage:', tour);
    
    if (onTourPress) {
      onTourPress(tour);
    }
    
    setTimeout(() => {
      router.push(`/trip-detail/${tour.id || tour._id}`);
    }, 200);
  };

  const handleVoucherPress = (voucher: any) => {
    if (onVoucherPress) {
      onVoucherPress(voucher);
    }
  };

  const handleVoucherSave = async (voucher: any) => {
    if (onVoucherSave) {
      return await onVoucherSave(voucher);
    }
    throw new Error('onVoucherSave not provided');
  };

  // ✨ NEW: Handle login required callback
  const handleLoginRequired = () => {
    if (onLoginRequired) {
      onLoginRequired();
    } else {
      // Fallback - navigate to login screen
      console.log('🔐 Login required - no callback provided');
      // You can add default navigation to login screen here
      // router.push('/login');
    }
  };

  const shouldShowText = () => {
    if (isUser) return true;
    const hasTours = item.tours && item.tours.length > 0;
    const hasVouchers = item.vouchers && item.vouchers.length > 0;
    return !hasTours && !hasVouchers;
  };

  const shouldShowTextWithCards = () => {
    if (isUser) return false;
    const hasTours = item.tours && item.tours.length > 0;
    const hasVouchers = item.vouchers && item.vouchers.length > 0;
    const hasReplyText = item.text && item.text.trim().length > 0;
    return hasReplyText && (hasTours || hasVouchers);
  };

  const getTextStyle = (text: string) => {
    if (text && text.trim() === 'undefined') {
      return { maxHeight: 0, overflow: 'hidden' };
    }
    return {};
  };

  const getHideStyle = (text: string) => {
    if (typeof text === 'string' && text.trim() === 'undefined') {
      return { height: 0, opacity: 0 };
    }
    return {};
  };

  return (
    <View style={[styles.messageRow, isUser ? styles.userRow : styles.botRow]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          {showAvatar ? (
            <View style={styles.botAvatar}>
              <Image 
source={require('../../../../assets/images/Logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.avatarSpacer} />
          )}
        </View>
      )}

      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage
        ]}
      >
        {shouldShowText() &&
          typeof item.text === 'string' &&
          item.text.trim().length > 0 && (
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userMessageText : styles.botMessageText,
                getHideStyle(item.text)
              ]}
            >
              {item.text}
            </Text>
        )}

        {shouldShowTextWithCards() &&
          typeof item.text === 'string' &&
          item.text.trim().length > 0 && (
            <Text
              style={[
                styles.messageText,
                styles.botMessageText,
                styles.textWithCards,
                getHideStyle(item.text)
              ]}
            >
              {item.text}
            </Text>
        )}

        {/* Tour Cards */}
        {!isUser && item.tours && item.tours.length > 0 && (
          <View style={styles.cardsContainer}>
            <TourCards tours={item.tours} onTourPress={handleTourPress} />
          </View>
        )}

        {/* ✨ UPDATED: Voucher Cards with login support */}
        {!isUser && item.vouchers && item.vouchers.length > 0 && (
          <View style={styles.cardsContainer}>
            <VoucherCards
              vouchers={item.vouchers}
              onVoucherPress={handleVoucherPress}
              onVoucherSave={handleVoucherSave}
              userInfo={userInfo}
              savingVoucherId={savingVoucherId}
              isLoggedIn={isLoggedIn} // ✨ NEW: Pass login status
              onLoginRequired={handleLoginRequired} // ✨ NEW: Pass login callback
            />
          </View>
        )}

        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          {isUser && (
            <View style={styles.readStatus}>
              {item.isRead ? (
                <View style={styles.readAvatar}>
                  <View style={styles.miniAvatar} />
                </View>
              ) : (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          )}
        </View>
      </View>

      {isUser && (
        <View style={styles.userAvatarContainer}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export const TypingIndicator: React.FC = () => {
  return (
    <View style={[styles.messageRow, styles.botRow]}>
      <View style={styles.avatarContainer}>
        <View style={styles.botAvatar}>
          <Image 
            source={require('../../../../assets/images/Logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={[styles.messageContainer, styles.botMessage, styles.typingContainer]}>
        <Text style={styles.typingText}>Đang nhập...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16
  },
  userRow: {
    justifyContent: 'flex-end'
  },
  botRow: {
    justifyContent: 'flex-start'
  },
  avatarContainer: {
    width: 32,
    justifyContent: 'flex-end',
    marginRight: 8
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2a6ee4ff', // Nền xanh cho logo
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    width: 20,
    height: 20,
  },
  avatarSpacer: {
    width: 28,
    height: 28
  },
  userAvatarContainer: {
    width: 32,
    justifyContent: 'flex-end',
    marginLeft: 8
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 14
  },
  messageContainer: {
     maxWidth: screenWidth * 0.79,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
      alignSelf: 'flex-start'
  },
  userMessage: {
    backgroundColor: '#0084FF',
    borderBottomRightRadius: 4
  },
  botMessage: {
    backgroundColor: '#e5e5e5ff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20
  },
  userMessageText: {
    color: '#fff'
  },
  botMessageText: {
    color: '#050505'
  },
  textWithCards: {
    marginBottom: 8
  },
  cardsContainer: {
    marginTop: 8,
    marginHorizontal: 0,
    width: '100%'
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4
  },
  timestamp: {
    fontSize: 11,
    color: '#65676B'
  },
  readStatus: {
    marginLeft: 8
  },
  readAvatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  miniAvatar: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff'
  },
  checkmark: {
    fontSize: 12,
    color: '#0084FF'
  },
  typingContainer: {
    paddingVertical: 12
  },
  typingText: {
    fontSize: 14,
    color: '#65676B',
    fontStyle: 'italic'
  }
});