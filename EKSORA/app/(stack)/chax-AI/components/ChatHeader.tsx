// components/ChatHeader.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { ConnectionStatus } from '../types/chat';

interface ChatHeaderProps {
  connectionStatus: ConnectionStatus;
  onClose: () => void;
  onRetry: () => void;
  userDisplayName?: string;
  isLoggedIn?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  connectionStatus, 
  onClose, 
  onRetry 
}) => {
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Đang hoạt động';
      case 'connecting': return 'Đang kết nối...';
      case 'disconnected': return 'Offline';
    }
  };

  const getStatusDotStyle = () => {
    switch (connectionStatus) {
      case 'connected': return styles.statusConnected;
      case 'connecting': return styles.statusConnecting;
      case 'disconnected': return styles.statusDisconnected;
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerAvatar}>
          <Image 
            source={require('../../../../assets/images/Logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={styles.headerTitle}>Trợ lý Eksora</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, getStatusDotStyle()]} />
            <Text style={styles.headerSubtitle}>{getStatusText()}</Text>
            {connectionStatus === 'disconnected' && (
              <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                <Text style={styles.retryText}>🔄</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
   
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EA',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a6ee4ff', // Nền xanh cho logo
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#050505',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusConnected: {
    backgroundColor: '#42B883',
  },
  statusConnecting: {
    backgroundColor: '#FFA500',
  },
  statusDisconnected: {
    backgroundColor: '#FF6B6B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#65676B',
  },
  retryButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 10,
    backgroundColor: '#E7F3FF',
  },
  retryText: {
    fontSize: 12,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#65676B',
    fontWeight: 'bold',
  },
});