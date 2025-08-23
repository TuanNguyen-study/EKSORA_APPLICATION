// components/ChatMessage.tsx - FIXED VERSION FOR iOS
import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { Message } from '../types/chat';
import TourCards from '../components/TourCards';
import VoucherCards from '../components/VoucherCards';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  isLoggedIn?: boolean;
  onLoginRequired?: () => void;
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
  isLoggedIn = false,
  onLoginRequired
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const handleLoginRequired = () => {
    if (onLoginRequired) {
      onLoginRequired();
    } else {
      console.log('🔐 Login required - no callback provided');
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

        {/* Voucher Cards */}
        {!isUser && item.vouchers && item.vouchers.length > 0 && (
          <View style={styles.cardsContainer}>
            <VoucherCards
              vouchers={item.vouchers}
              onVoucherPress={handleVoucherPress}
              onVoucherSave={handleVoucherSave}
              userInfo={userInfo}
              savingVoucherId={savingVoucherId}
              isLoggedIn={isLoggedIn}
              onLoginRequired={handleLoginRequired}
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
    paddingHorizontal: 16,
    // FIX: Prevent overflow and ensure proper layout
    maxWidth: screenWidth,
    alignSelf: 'stretch',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    justifyContent: 'flex-end',
    marginRight: 8,
    flexShrink: 0, // FIX: Prevent avatar from shrinking
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2a6ee4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 20,
    height: 20,
  },
  avatarSpacer: {
    width: 28,
    height: 28,
  },
  userAvatarContainer: {
    width: 32,
    justifyContent: 'flex-end',
    marginLeft: 8,
    flexShrink: 0, // FIX: Prevent avatar from shrinking
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    color: '#fff',
  },
  messageContainer: {
    // FIX: Better width calculation to prevent overflow
    maxWidth: screenWidth - 32 - 32 - 16 - 16, // screenWidth - avatars - margins - padding
    minWidth: 60, // Minimum width for very short messages
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1, // FIX: Allow flexible sizing
    // FIX: iOS specific shadow optimization
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userMessage: {
    backgroundColor: '#0084FF',
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e5e5e5ff',
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    // FIX: Prevent text overflow
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#050505',
  },
  textWithCards: {
    marginBottom: 8,
  },
  cardsContainer: {
    marginTop: 8,
    marginHorizontal: 0,
    width: '100%',
    // FIX: Prevent cards from overflowing
    maxWidth: '100%',
    overflow: 'hidden',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    // FIX: Prevent footer from breaking layout
    flexWrap: 'nowrap',
  },
  timestamp: {
    fontSize: 11,
    color: '#65676B',
    flexShrink: 1, // Allow timestamp to shrink if needed
  },
  readStatus: {
    marginLeft: 8,
    flexShrink: 0, // Keep read status fixed size
  },
  readAvatar: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  checkmark: {
    fontSize: 12,
    color: '#0084FF',
  },
  typingContainer: {
    paddingVertical: 12,
  },
  typingText: {
    fontSize: 14,
    color: '#65676B',
    fontStyle: 'italic',
  },
});