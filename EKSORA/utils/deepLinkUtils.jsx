// deepLinkUtils.jsx - Tự tạo deeplink cho Expo Go (Không cần API)
import { Linking } from "react-native";

class DeepLinkUtils {
  constructor() {
    // Cấu hình tự tạo deeplink - thay đổi theo tài khoản của bạn
    this.expoUsername = "voanh0506"; // Thay bằng username Expo của bạn
    this.projectSlug = "EKSORA"; // Tên project trong Expo
    this.webDomain = "localhost:3000"; // Thay bằng domain thật hoặc localhost
    this.useLocalhost = true; // Dùng localhost cho development
  }

  // Tạo Expo Go deeplink - format chuẩn và tương thích
  createExpoDeepLink(tourId) {
    // Format chính thức cho Expo Go
    const expoFormat = `exp://exp.host/@${this.expoUsername}/${this.projectSlug}`;
    // Format với query parameter
    const expoWithQuery = `exp://exp.host/@${this.expoUsername}/${this.projectSlug}?tourId=${tourId}`;
    // Format custom scheme cho production
    const customScheme = `eksora://tour/${tourId}`;

    return {
      expo: expoFormat,
      expoQuery: expoWithQuery,
      custom: customScheme,
      primary: expoWithQuery, // Sử dụng expo với query làm chính
    };
  }

  // Tạo Universal Link (cho app đã publish)
  createUniversalLink(tourId) {
    if (this.useLocalhost) {
      // Dùng GitHub Pages hoặc Netlify để demo
      return `https://voanh0506.github.io/eksora-demo/tour/${tourId}`;
    }
    return `https://${this.webDomain}/dl/tour/${tourId}`;
  }

  // Tạo Web fallback link
  createWebLink(tourId) {
    if (this.useLocalhost) {
      // Fallback về trang demo hoặc landing page
      return `https://voanh0506.github.io/eksora-demo/tour/${tourId}`;
    }
    return `https://${this.webDomain}/tour/${tourId}`;
  }

  // Tạo smart link dựa trên môi trường
  createSmartShareLink(tourId) {
    const expoLinks = this.createExpoDeepLink(tourId);
    const webLink = this.createWebLink(tourId);
    const universalLink = this.createUniversalLink(tourId);

    return {
      primary: expoLinks.primary, // Ưu tiên expo với query
      expoScheme: expoLinks.expo,
      expoQuery: expoLinks.expoQuery,
      expoCustom: expoLinks.custom,
      universalLink: universalLink,
      webFallback: webLink,
      appScheme: `eksora://tour/${tourId}`, // Cho app standalone
      shareableText: `🌟 Xem tour này trên EKSORA!\n\nTour ID: ${tourId}\n\n📱 Mở trong Expo Go hoặc trình duyệt`, // Text có thể share
    };
  }

  // Tạo nội dung share message
  createShareMessage(tourData, smartLinks) {
    const { name, price, cateID } = tourData;

    // Format price
    const formatPrice = (priceValue) => {
      if (typeof priceValue === "object" && priceValue !== null) {
        priceValue = priceValue.current || priceValue.original || 0;
      }
      if (typeof priceValue === "number") {
        return priceValue.toLocaleString("vi-VN");
      }
      if (typeof priceValue === "string" && !isNaN(priceValue)) {
        return Number(priceValue).toLocaleString("vi-VN");
      }
      return priceValue || "0";
    };

    const formattedPrice = formatPrice(price);
    const location = cateID?.name || "Việt Nam";

    const title = `🌟 ${name} - Chỉ từ ${formattedPrice}đ`;
    const message = `${title}\n\n📍 Khám phá ${name} tại ${location}\n\n🔗 Mở trong app: ${smartLinks.primary}\n\n📱 Hoặc mở web: ${smartLinks.webFallback}`;

    return {
      title,
      message,
      url: smartLinks.primary, // Sử dụng deeplink Expo thực tế
    };
  }

  // Thử mở deeplink thông minh với nhiều fallback
  async openSmartLink(tourId) {
    const links = this.createSmartShareLink(tourId);

    try {
      // Trong development: thử các format Expo trước
      if (__DEV__) {
        console.log("🧪 Testing Expo formats...");

        // Thử format expo với query trước (tương thích nhất)
        try {
          console.log("Trying Expo with query:", links.expoQuery);
          const canOpenExpoQuery = await Linking.canOpenURL(links.expoQuery);
          if (canOpenExpoQuery) {
            await Linking.openURL(links.expoQuery);
            return { success: true, method: "expo-query" };
          }
        } catch (queryError) {
          console.log("Expo query failed:", queryError.message);
        }

        // Thử format expo đơn giản (chỉ mở app)
        try {
          console.log("Trying simple Expo format:", links.expoScheme);
          const canOpenExpo = await Linking.canOpenURL(links.expoScheme);
          if (canOpenExpo) {
            await Linking.openURL(links.expoScheme);
            return { success: true, method: "expo-simple" };
          }
        } catch (expoError) {
          console.log("Simple expo failed:", expoError.message);
        }

        // Thử custom scheme cuối cùng
        try {
          console.log("Trying custom scheme:", links.expoCustom);
          const canOpenCustom = await Linking.canOpenURL(links.expoCustom);
          if (canOpenCustom) {
            await Linking.openURL(links.expoCustom);
            return { success: true, method: "expo-custom" };
          }
        } catch (customError) {
          console.log("Custom scheme failed:", customError.message);
        }

        // Thử format simple (chỉ mở app, không navigate)
        try {
          console.log("Trying simple Expo format:", links.expoSimple);
          const canOpenSimple = await Linking.canOpenURL(links.expoSimple);
          if (canOpenSimple) {
            await Linking.openURL(links.expoSimple);
            return { success: true, method: "expo-simple" };
          }
        } catch (simpleError) {
          console.log("Simple format failed:", simpleError.message);
        }

        console.log("⚠️ All Expo formats failed, falling back to web...");
      }

      // Thử universal link
      console.log("Attempting to open universal link:", links.universalLink);
      const canOpenUniversal = await Linking.canOpenURL(links.universalLink);
      if (canOpenUniversal) {
        await Linking.openURL(links.universalLink);
        return { success: true, method: "universal" };
      }

      // Thử app scheme (cho standalone app)
      console.log("Attempting to open app scheme:", links.appScheme);
      const canOpenApp = await Linking.canOpenURL(links.appScheme);
      if (canOpenApp) {
        await Linking.openURL(links.appScheme);
        return { success: true, method: "app" };
      }

      // Fallback về web
      console.log("Falling back to web link:", links.webFallback);
      await Linking.openURL(links.webFallback);
      return { success: true, method: "web" };
    } catch (error) {
      console.error("Error opening smart link:", error);

      // Last resort: mở web link
      try {
        await Linking.openURL(links.webFallback);
        return { success: true, method: "web" };
      } catch (webError) {
        console.error("Failed to open web link:", webError);
        return { success: false, method: "none", error: webError.message };
      }
    }
  }

  // Kiểm tra app có thể mở URL không
  async canOpenDeepLink(url) {
    try {
      return await Linking.canOpenURL(url);
    } catch (error) {
      console.error("Error checking URL:", error);
      return false;
    }
  }

  // Log thông tin debug
  logDebugInfo(tourId) {
    const links = this.createSmartShareLink(tourId);
    console.log("=== FIXED EXPO DEEPLINK INFO ===");
    console.log("🆔 Tour ID:", tourId);
    console.log("⚡ Mode: Multi-Format Expo (Fixed)");
    console.log("📱 Expo Modern:", links.expoModern);
    console.log("📱 Expo Legacy:", links.expoLegacy);
    console.log("📱 Expo Simple:", links.expoSimple);
    console.log("🔗 Universal Link:", links.universalLink);
    console.log("🌐 Web Fallback:", links.webFallback);
    console.log("🚀 App Scheme:", links.appScheme);
    console.log("✅ Primary Link:", links.primary);
    console.log("=====================================");
    return links;
  }
}

// Export singleton instance
const deepLinkUtils = new DeepLinkUtils();
export default deepLinkUtils;
