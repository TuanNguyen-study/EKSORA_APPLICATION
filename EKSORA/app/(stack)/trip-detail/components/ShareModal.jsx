import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Share,
  Linking,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";

const ShareModal = ({ visible, onClose, tourData }) => {
  if (!tourData) {
    return null;
  }

  const { _id, name, image, price, cateID } = tourData;

  // Xử lý price - có thể là object hoặc number
  const getPrice = (priceValue) => {
    if (typeof priceValue === "object" && priceValue !== null) {
      return priceValue.current || priceValue.original || 0;
    }
    return priceValue || 0;
  };

  const actualPrice = getPrice(price);

  // Xử lý price an toàn hơn
  const formatPrice = (priceValue) => {
    if (typeof priceValue === "number") {
      return priceValue.toLocaleString("vi-VN");
    }
    if (typeof priceValue === "string" && !isNaN(priceValue)) {
      return Number(priceValue).toLocaleString("vi-VN");
    }
    return priceValue || "0";
  };

  // Tạo URL chia sẻ
  const shareUrl = `https://eksora.com/tour/${_id}`;
  const shareTitle = `${name} - Chỉ từ ${formatPrice(actualPrice)}đ`;

  // Tạo message theo format trong hình
  const fullShareMessage = `${shareTitle}\n\nKhám phá ${name} tại ${cateID?.name || "undefined"}. Đặt tour ngay tại EKSORA!\n\n${shareUrl}`;

  // Lấy ảnh đầu tiên của tour
  const tourImage = image && image.length > 0 ? image[0] : null;

  // Hàm chia sẻ lên Facebook
  const shareToFacebook = async () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    try {
      const supported = await Linking.canOpenURL(facebookUrl);
      if (supported) {
        await Linking.openURL(facebookUrl);
        onClose(); // Đóng modal ngay lập tức
      } else {
        Alert.alert("Lỗi", "Không thể mở Facebook");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ lên Facebook");
    }
  };

  // Hàm chia sẻ lên Twitter
  const shareToTwitter = async () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;

    try {
      const supported = await Linking.canOpenURL(twitterUrl);
      if (supported) {
        await Linking.openURL(twitterUrl);
        onClose(); // Đóng modal ngay lập tức
      } else {
        Alert.alert("Lỗi", "Không thể mở Twitter");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ lên Twitter");
    }
  };

  // Hàm chia sẻ qua WhatsApp
  const shareToWhatsApp = async () => {
    try {
      // Thử các URL scheme khác nhau cho WhatsApp
      const whatsappUrls = [
        `https://wa.me/?text=${encodeURIComponent(fullShareMessage)}`,
        `whatsapp://send?text=${encodeURIComponent(fullShareMessage)}`,
        'whatsapp://'
      ];

      let appOpened = false;
      
      for (const url of whatsappUrls) {
        try {
          const supported = await Linking.canOpenURL(url);
          
          if (supported) {
            await Linking.openURL(url);
            onClose();
            appOpened = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // Nếu không thể detect app, thử mở trực tiếp
      if (!appOpened) {
        try {
          const directUrl = `https://wa.me/?text=${encodeURIComponent(fullShareMessage)}`;
          await Linking.openURL(directUrl);
          onClose();
          appOpened = true;
        } catch (error) {
          // Silent fail
        }
      }

      // Chỉ hiển thị dialog nếu thực sự không thể mở
      if (!appOpened) {
        const storeUrl = Platform.OS === "ios"
          ? "https://apps.apple.com/app/whatsapp-messenger/id310633997"
          : "https://play.google.com/store/apps/details?id=com.whatsapp";

        Alert.alert(
          "Cần tải ứng dụng",
          "Bạn cần tải ứng dụng WhatsApp để chia sẻ. Bạn có muốn tải về không?",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Tải về",
              onPress: async () => {
                try {
                  await Linking.openURL(storeUrl);
                  onClose();
                } catch (error) {
                  Alert.alert("Lỗi", "Không thể mở cửa hàng ứng dụng");
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ qua WhatsApp");
    }
  };

  // Hàm chia sẻ qua Telegram
  const shareToTelegram = async () => {
    try {
      // Thử các URL scheme khác nhau cho Telegram
      const telegramUrls = [
        `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
        `tg://msg?text=${encodeURIComponent(fullShareMessage)}`,
        'tg://'
      ];

      let appOpened = false;
      
      for (const url of telegramUrls) {
        try {
          const supported = await Linking.canOpenURL(url);
          
          if (supported) {
            await Linking.openURL(url);
            onClose();
            appOpened = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // Nếu không thể detect app, thử mở trực tiếp
      if (!appOpened) {
        try {
          const directUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
          await Linking.openURL(directUrl);
          onClose();
          appOpened = true;
        } catch (error) {
          // Silent fail
        }
      }

      // Chỉ hiển thị dialog nếu thực sự không thể mở
      if (!appOpened) {
        const storeUrl = Platform.OS === "ios"
          ? "https://apps.apple.com/app/telegram-messenger/id686449807"
          : "https://play.google.com/store/apps/details?id=org.telegram.messenger";

        Alert.alert(
          "Cần tải ứng dụng",
          "Bạn cần tải ứng dụng Telegram để chia sẻ. Bạn có muốn tải về không?",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Tải về",
              onPress: async () => {
                try {
                  await Linking.openURL(storeUrl);
                  onClose();
                } catch (error) {
                  Alert.alert("Lỗi", "Không thể mở cửa hàng ứng dụng");
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ qua Telegram");
    }
  };

  // Hàm chia sẻ qua Messenger (sửa lỗi)
  const shareToMessenger = async () => {
    try {
      // Sử dụng Share API với title để hệ thống tự detect Messenger
      const result = await Share.share({
        message: fullShareMessage,
        title: shareTitle,
        url: shareUrl,
      });
      
      if (result.action === Share.sharedAction) {
        onClose();
        return;
      }
      
      // Fallback: Thử mở Messenger trực tiếp
      const messengerUrl = Platform.OS === "android" 
        ? 'fb-messenger://share'
        : 'fb-messenger://';
      
      try {
        await Linking.openURL(messengerUrl);
        onClose();
      } catch (directError) {
        // Cuối cùng, hiển thị dialog tải app
        const storeUrl = Platform.OS === "ios"
          ? "https://apps.apple.com/app/messenger/id454638411"
          : "https://play.google.com/store/apps/details?id=com.facebook.orca";

        Alert.alert(
          "Cần tải ứng dụng",
          "Bạn cần tải ứng dụng Messenger để chia sẻ. Bạn có muốn tải về không?",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Tải về",
              onPress: async () => {
                try {
                  await Linking.openURL(storeUrl);
                  onClose();
                } catch (error) {
                  Alert.alert("Lỗi", "Không thể mở cửa hàng ứng dụng");
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ qua Messenger: " + error.message);
    }
  };

  // Hàm chia sẻ qua Zalo
  const shareToZalo = async () => {
    try {
      // Thử các URL scheme khác nhau cho Zalo
      const zaloUrls = [
        'zalo://share',
        'zalo://',
        `zalo://share?text=${encodeURIComponent(fullShareMessage)}`
      ];

      let appOpened = false;
      
      for (const url of zaloUrls) {
        try {
          const supported = await Linking.canOpenURL(url);
          
          if (supported) {
            await Linking.openURL(url);
            onClose();
            appOpened = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      // Nếu không thể detect app, thử mở trực tiếp
      if (!appOpened) {
        try {
          const directUrl = `zalo://share?text=${encodeURIComponent(fullShareMessage)}`;
          await Linking.openURL(directUrl);
          onClose();
          appOpened = true;
        } catch (error) {
          // Silent fail
        }
      }

      // Chỉ hiển thị dialog nếu thực sự không thể mở
      if (!appOpened) {
        const storeUrl = Platform.OS === "ios"
          ? "https://apps.apple.com/app/zalo/id579523206"
          : "https://play.google.com/store/apps/details?id=com.zing.zalo";

        Alert.alert(
          "Cần tải ứng dụng",
          "Bạn cần tải ứng dụng Zalo để chia sẻ. Bạn có muốn tải về không?",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Tải về",
              onPress: async () => {
                try {
                  await Linking.openURL(storeUrl);
                  onClose();
                } catch (error) {
                  Alert.alert("Lỗi", "Không thể mở cửa hàng ứng dụng");
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ qua Zalo");
    }
  };

  // Hàm chia sẻ chung
  const handleGeneralShare = async () => {
    try {
      const result = await Share.share({
        message: fullShareMessage,
        title: shareTitle,
        url: shareUrl,
      });

      if (result.action === Share.sharedAction) {
        onClose(); // Đóng modal ngay lập tức
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chia sẻ nội dung này");
    }
  };

  // Hàm copy link
  const copyLink = async () => {
    try {
      await Share.share({
        message: shareUrl,
        title: shareTitle,
        url: shareUrl,
      });
      onClose(); // Đóng modal ngay lập tức
    } catch (error) {
      onClose(); // Đóng modal ngay lập tức
    }
  };

  const shareOptions = [
    {
      title: "Facebook",
      icon: "logo-facebook",
      color: "#1877F2",
      onPress: shareToFacebook,
    },
    {
      title: "Messenger",
      icon: "chatbubble-ellipses",
      color: "#0084FF",
      onPress: shareToMessenger,
    },
    {
      title: "Twitter",
      icon: "logo-twitter",
      color: "#1DA1F2",
      onPress: shareToTwitter,
    },
    {
      title: "WhatsApp",
      icon: "logo-whatsapp",
      color: "#25D366",
      onPress: shareToWhatsApp,
    },
    {
      title: "Zalo",
      icon: "chatbubbles",
      color: "#0068FF",
      onPress: shareToZalo,
    },
    {
      title: "Telegram",
      icon: "paper-plane",
      color: "#0088CC",
      onPress: shareToTelegram,
    },
    {
      title: "Copy Link",
      icon: "link",
      color: "#666666",
      onPress: copyLink,
    },
    {
      title: "Khác",
      icon: "share-outline",
      color: COLORS.primary,
      onPress: handleGeneralShare,
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {/* Touchable overlay để đóng modal */}
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chia sẻ chuyến đi</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Tour Info với hình ảnh */}
            <View style={styles.tourInfo}>
              {tourImage && (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: tourImage }}
                    style={styles.tourImage}
                    resizeMode="cover"
                  />
                </View>
              )}
              <View style={styles.tourDetails}>
                <Text style={styles.tourName} numberOfLines={2}>
                  {name}
                </Text>
                <View style={styles.tourMeta}>
                  <Text style={styles.tourPrice}>
                    Từ {formatPrice(actualPrice)}đ
                  </Text>
                  <Text style={styles.tourLocation}>
                    📍 {cateID?.name || "Việt Nam"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Share Options */}
            <View style={styles.shareOptionsContainer}>
              {shareOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.shareOption}
                  onPress={option.onPress}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${option.color}15` },
                    ]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={option.color}
                    />
                  </View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bottom spacing cho safe area */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: "85%",
    minHeight: "50%",
  },
  overlayTouchable: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  tourInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  imageContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tourImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#f0f0f0",
  },
  tourDetails: {
    // Container cho thông tin tour
  },
  tourName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  tourMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  tourPrice: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
  },
  tourLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  imageCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: "italic",
    marginTop: 4,
  },
  shareOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    justifyContent: "space-between",
  },
  shareOption: {
    alignItems: "center",
    width: "22%",
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 11,
    color: COLORS.text,
    textAlign: "center",
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ShareModal;
