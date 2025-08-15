// useDeepLink.jsx - Hook để handle deeplink navigation
import { useEffect, useRef } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";

export const useDeepLink = () => {
  const router = useRouter();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Handle deeplink khi app được mở từ link
    const handleInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && isInitialMount.current) {
          console.log("🔗 Initial URL:", initialUrl);
          handleDeepLink(initialUrl);
        }
      } catch (error) {
        console.error("❌ Lỗi get initial URL:", error);
      } finally {
        isInitialMount.current = false;
      }
    };

    // Handle deeplink khi app đang chạy
    const handleUrlChange = (event) => {
      if (!isInitialMount.current) {
        console.log("🔗 URL Change:", event.url);
        handleDeepLink(event.url);
      }
    };

    // Parse và navigate deeplink
    const handleDeepLink = (url) => {
      try {
        console.log("🔗 Processing deeplink:", url);

        // Kiểm tra nếu là custom scheme eksora://
        if (url.startsWith("eksora://")) {
          const parts = url.replace("eksora://", "").split("/");
          // Handle format eksora://tour/{id}
          if (parts[0] === "tour" && parts[1]) {
            const tourId = parts[1];
            router.replace(`/(stack)/trip-detail/${tourId}`);
            console.log("✅ Custom scheme navigation to trip-detail:", tourId);
            return;
          }
          // Handle format eksora://trip-detail/{id} (từ expo-linking)
          if (parts[0] === "trip-detail" && parts[1]) {
            const tourId = parts[1];
            router.replace(`/(stack)/trip-detail/${tourId}`);
            console.log("✅ Expo-linking navigation to trip-detail:", tourId);
            return;
          }
        }

        // Kiểm tra nếu URL có path-based routing
        if (
          url.includes("/(stack)/trip-detail/") ||
          url.includes("/trip-detail/")
        ) {
          let tourId = null;
          if (url.includes("/(stack)/trip-detail/")) {
            tourId = url.split("/(stack)/trip-detail/")[1];
          } else if (url.includes("/trip-detail/")) {
            tourId = url.split("/trip-detail/")[1];
          }
          if (tourId) {
            // Loại bỏ query string nếu có
            tourId = tourId.split("?")[0];
            router.replace(`/(stack)/trip-detail/${tourId}`);
            console.log("✅ Path-based navigation to trip-detail:", tourId);
            return;
          }
        }

        // Parse URL để lấy query parameters
        try {
          const urlObj = new URL(url);
          const params = new URLSearchParams(urlObj.search);

          // Lấy tourId từ parameters
          const tourId = params.get("tourId") || params.get("id");

          console.log("📱 Tour ID from query:", tourId);

          if (tourId) {
            router.replace(`/(stack)/trip-detail/${tourId}`);
            console.log("✅ Query-based navigation to trip-detail:", tourId);
            return;
          }
        } catch (parseError) {
          console.log("URL parse failed, trying fallback");
        }

        // Fallback về home screen
        router.replace("/(tabs)/home");
        console.log("🏠 Fallback to home");
      } catch (error) {
        console.error("❌ Lỗi parse deeplink:", error);
        // Fallback về home screen
        router.replace("/(tabs)/home");
      }
    };

    // Set up listeners
    handleInitialURL();
    const subscription = Linking.addEventListener("url", handleUrlChange);

    // Cleanup
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [router]);

  return null; // Hook không return gì
};

export default useDeepLink;
