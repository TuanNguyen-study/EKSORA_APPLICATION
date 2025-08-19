import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Share,
  Linking,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/colors";
import * as ExpoLinking from "expo-linking";
import Toast from 'react-native-toast-message';

const ShareModal = ({ visible, onClose, tourData }) => {
  const [smartLinks, setSmartLinks] = useState(null);
  const [shareContent, setShareContent] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!tourData) {
    return null;
  }

  const { _id, name, image, price, cateID } = tourData;

  // Tạo deeplink khi modal được mở
  useEffect(() => {
    if (visible && _id) {
      createSmartDeepLink();
    }
  }, [visible, _id]);

  const createSmartDeepLink = async () => {
    try {
      setLoading(true);
      console.log("🚀 Tạo deeplink với expo-linking cho tour ID:", _id);

      // Tạo deeplink sử dụng expo-linking với scheme eksora
      const url = ExpoLinking.createURL(`trip-detail/${_id}`, {
        scheme: "eksora",
      });

      console.log("🔗 Generated deeplink:", url);

      // Không cần web fallback, chỉ dùng deeplink Expo
      const links = {
        primary: url,
        webFallback: url, // Cũng dùng deeplink Expo
        expoScheme: url,
        universalLink: url,
        appScheme: url,
        shareableText: url,
      };

      setSmartLinks(links);

      // Tạo share content
      const content = {
        title: `${name} - Tour EKSORA`,
        message: `🌟 Khám phá tour "${name}"\n\n🔗 Mở trong app Expo: ${url}`,
        url: url,
      };

      setShareContent(content);

      // Log debug info trong development
      if (__DEV__) {
        console.log("✅ Deeplinks với expo-linking đã tạo thành công:", links);
      }
    } catch (error) {
      console.error("❌ Lỗi tạo deeplink với expo-linking:", error);

      // Fallback về deeplink Expo đơn giản
      const fallbackDeepLink = ExpoLinking.createURL(`trip-detail/${_id}`);

      const fallbackContent = {
        title: `${name} - Tour EKSORA`,
        message: `🌟 Khám phá tour "${name}"\n\n🔗 Mở trong app Expo: ${fallbackDeepLink}`,
        url: fallbackDeepLink,
      };

      setShareContent(fallbackContent);
      setSmartLinks({
        primary: fallbackDeepLink,
        webFallback: fallbackDeepLink,
        expoScheme: fallbackDeepLink,
        universalLink: fallbackDeepLink,
        appScheme: fallbackDeepLink,
        shareableText: fallbackDeepLink,
      });
    } finally {
      setLoading(false);
    }
  };

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

  // Hàm test deeplink
  const testDeepLink = async () => {
    if (!smartLinks) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: 'Smart links chưa sẵn sàng. Vui lòng đợi...'
      });
      return;
    }

    try {
      console.log("🧪 Testing deeplink...");
      const result = await deepLinkUtils.openSmartLink(_id);

      let message = "";
      let icon = "";

      switch (result.method) {
        case "expo-query":
          message = "✅ Đã mở Expo Go (Expo Query)";
          icon = "📱";
          break;
        case "expo-simple":
          message = "✅ Đã mở Expo Go (Expo Simple)";
          icon = "📱";
          break;
        case "expo-custom":
          message = "✅ Đã mở Expo Go (Custom scheme)";
          icon = "📱";
          break;
        case "expo":
          message = "✅ Đã mở trong Expo Go";
          icon = "📱";
          break;
        case "app":
          message = "✅ Đã mở trong ứng dụng EKSORA";
          icon = "🚀";
          break;
        case "universal":
          message = "✅ Đã mở universal link";
          icon = "🔗";
          break;
        case "web":
          message = "✅ Đã mở trên trình duyệt web";
          icon = "🌐";
          break;
        default:
          message = "❌ Không thể mở liên kết";
          icon = "⚠️";
      }

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Test Deeplink',
          text2: `${icon} ${message}`
        });
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: `❌ ${message}\n\nLỗi: ${result.error || "Không xác định"}`
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: `❌ Có lỗi xảy ra khi test deeplink:\n${error.message}`
      });
    }
  };

  // Sử dụng shareContent nếu có, fallback về Expo format
  const currentShareUrl =
    shareContent?.url || `exp://exp.host/@voanh0506/EKSORA?tourId=${_id}`;
  const currentShareTitle = shareContent?.title || `${name} - Tour EKSORA`;
  const currentShareMessage =
    shareContent?.message ||
    `🌟 ${name}\n\nKhám phá tour tuyệt vời!\n\n🔗 Mở trong app: exp://exp.host/@voanh0506/EKSORA?tourId=${_id}`;

  // Lấy ảnh đầu tiên của tour
  const tourImage = image && image.length > 0 ? image[0] : null;

  // Hàm chia sẻ lên Facebook - chỉ share text
  const shareToFacebook = async () => {
    try {
      // Sử dụng Share API thay vì link trực tiếp
      const result = await Share.share({
        message: currentShareMessage,
        title: currentShareTitle,
      });

      if (result.action === Share.sharedAction) {
        onClose();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chia sẻ lên Facebook'
      });
    }
  };

  // Hàm chia sẻ lên Twitter - chỉ share text
  const shareToTwitter = async () => {
    try {
      // Sử dụng Share API thay vì link trực tiếp
      const result = await Share.share({
        message: currentShareMessage,
        title: currentShareTitle,
      });

      if (result.action === Share.sharedAction) {
        onClose();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chia sẻ lên Twitter'
      });
    }
  };

  // Hàm chia sẻ qua WhatsApp
  const shareToWhatsApp = async () => {
    try {
      // Thử các URL scheme khác nhau cho WhatsApp
      const whatsappUrls = [
        `https://wa.me/?text=${encodeURIComponent(currentShareMessage)}`,
        `whatsapp://send?text=${encodeURIComponent(currentShareMessage)}`,
        "whatsapp://",
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
          const directUrl = `https://wa.me/?text=${encodeURIComponent(currentShareMessage)}`;
          await Linking.openURL(directUrl);
          onClose();
          appOpened = true;
        } catch (error) {
          // Silent fail
        }
      }

      // Chỉ hiển thị dialog nếu thực sự không thể mở
      if (!appOpened) {
        const storeUrl =
          Platform.OS === "ios"
            ? "https://apps.apple.com/app/whatsapp-messenger/id310633997"
            : "https://play.google.com/store/apps/details?id=com.whatsapp";

        Toast.show({
          type: 'error',
          text1: 'Cần tải ứng dụng',
          text2: 'Bạn cần tải ứng dụng WhatsApp để chia sẻ. Bạn có muốn tải về không?',
          visibilityTime: 5000,
          onPress: async () => {
            try {
              await Linking.openURL(storeUrl);
              onClose();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể mở cửa hàng ứng dụng'
              });
            }
          }
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chia sẻ qua WhatsApp'
      });
    }
  };

  // Hàm chia sẻ qua Telegram
  const shareToTelegram = async () => {
    try {
      // Thử các URL scheme khác nhau cho Telegram
      const telegramUrls = [
        `https://t.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(currentShareTitle)}`,
        `tg://msg?text=${encodeURIComponent(currentShareMessage)}`,
        "tg://",
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
          const directUrl = `https://t.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${encodeURIComponent(currentShareTitle)}`;
          await Linking.openURL(directUrl);
          onClose();
          appOpened = true;
        } catch (error) {
          // Silent fail
        }
      }

      // Chỉ hiển thị dialog nếu thực sự không thể mở
      if (!appOpened) {
        const storeUrl =
          Platform.OS === "ios"
            ? "https://apps.apple.com/app/telegram-messenger/id686449807"
            : "https://play.google.com/store/apps/details?id=org.telegram.messenger";

        Toast.show({
          type: 'error',
          text1: 'Cần tải ứng dụng',
          text2: 'Bạn cần tải ứng dụng Telegram để chia sẻ. Bạn có muốn tải về không?',
          visibilityTime: 5000,
          onPress: async () => {
            try {
              await Linking.openURL(storeUrl);
              onClose();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể mở cửa hàng ứng dụng'
              });
            }
          }
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chia sẻ qua Telegram'
      });
    }
  };

  // Hàm chia sẻ qua Messenger (sửa lỗi)
  const shareToMessenger = async () => {
    try {
      // Sử dụng Share API với title để hệ thống tự detect Messenger
      const result = await Share.share({
        message: currentShareMessage,
        title: currentShareTitle,
        url: currentShareUrl,
      });

      if (result.action === Share.sharedAction) {
        onClose();
        return;
      }

      // Fallback: Thử mở Messenger trực tiếp
      const messengerUrl =
        Platform.OS === "android" ? "fb-messenger://share" : "fb-messenger://";

      try {
        await Linking.openURL(messengerUrl);
        onClose();
      } catch (directError) {
        // Cuối cùng, hiển thị dialog tải app
        const storeUrl =
          Platform.OS === "ios"
            ? "https://apps.apple.com/app/messenger/id454638411"
            : "https://play.google.com/store/apps/details?id=com.facebook.orca";

        Toast.show({
          type: 'error',
          text1: 'Cần tải ứng dụng',
          text2: 'Bạn cần tải ứng dụng Messenger để chia sẻ. Bạn có muốn tải về không?',
          visibilityTime: 5000,
          onPress: async () => {
            try {
              await Linking.openURL(storeUrl);
              onClose();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể mở cửa hàng ứng dụng'
              });
            }
          }
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chia sẻ qua Messenger: ' + error.message
      });
    }
  };

  // Hàm chia sẻ qua Zalo
  const shareToZalo = async () => {
    try {
      // Thử các URL scheme khác nhau cho Zalo
      const zaloUrls = [
        "zalo://share",
        "zalo://",
        `zalo://share?text=${encodeURIComponent(currentShareMessage)}`,
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
          const directUrl = `zalo://share?text=${encodeURIComponent(currentShareMessage)}`;
          await Linking.openURL(directUrl);
          onClose();
          appOpened = true;
        } catch (error) {
          // Silent fail
        }
      }

      // Chỉ hiển thị dialog nếu thực sự không thể mở
      if (!appOpened) {
        const storeUrl =
          Platform.OS === "ios"
            ? "https://apps.apple.com/app/zalo/id579523206"
            : "https://play.google.com/store/apps/details?id=com.zing.zalo";

        Toast.show({
          type: 'error',
          text1: 'Cần tải ứng dụng',
          text2: 'Bạn cần tải ứng dụng Zalo để chia sẻ. Bạn có muốn tải về không?',
          visibilityTime: 5000,
          onPress: async () => {
            try {
              await Linking.openURL(storeUrl);
              onClose();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể mở cửa hàng ứng dụng'
              });
            }
          }
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chia sẻ qua Zalo'
      });
    }
  };

  // Hàm chia sẻ chung
  const handleGeneralShare = async () => {
    try {
      const result = await Share.share({
        message: currentShareMessage,
        title: currentShareTitle,
        url: currentShareUrl,
      });

      if (result.action === Share.sharedAction) {
        onClose(); // Đóng modal ngay lập tức
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chia sẻ nội dung này'
      });
    }
  };

  // Hàm copy link
  const copyLink = async () => {
    try {
      await Share.share({
        message: currentShareUrl,
        title: currentShareTitle,
        url: currentShareUrl,
      });
      onClose(); // Đóng modal ngay lập tức
    } catch (error) {
      onClose(); // Đóng modal ngay lập tức
    }
  };

  // Hàm chia sẻ deeplink
  const shareDeepLink = async () => {
    try {
      const result = await Share.share({
        message: `${currentShareTitle}\n\n${currentShareUrl}`,
        title: currentShareTitle,
        url: currentShareUrl,
      });

      if (result.action === Share.sharedAction) {
        onClose(); // Đóng modal ngay lập tức
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chia sẻ deeplink'
      });
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
      title: "Test App",
      icon: "phone-portrait-outline",
      color: "#FF6B35",
      onPress: testDeepLink,
    },
    {
      title: "DeepLink",
      icon: "link-outline",
      color: "#9C27B0",
      onPress: shareDeepLink,
    },
    {
      title: "Copy Link",
      icon: "copy-outline",
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
            <Text style={styles.headerTitle}>
              {loading ? "Đang tạo deeplink..." : "Chia sẻ chuyến đi"}
            </Text>
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

                {/* Debug links - hiển thị trong development */}
              </View>
            </View>

            {/* Share Options */}
            <View style={styles.shareOptionsContainer}>
              {shareOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.title || `option-${index}`}
                  style={[
                    styles.shareOption,
                    loading && styles.shareOptionDisabled,
                  ]}
                  onPress={loading ? null : option.onPress}
                  activeOpacity={loading ? 1 : 0.7}
                  disabled={loading}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: `${option.color}15`,
                        opacity: loading ? 0.5 : 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={option.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionTitle,
                      loading && styles.optionTitleDisabled,
                    ]}
                  >
                    {option.title}
                  </Text>
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
  debugContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  debugText: {
    fontSize: 10,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginBottom: 2,
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
  shareOptionDisabled: {
    opacity: 0.6,
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
  optionTitleDisabled: {
    color: COLORS.textSecondary,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ShareModal;