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
          if (parts[0] === "tour" && parts[1]) {
            const tourId = parts[1];
            router.push(`/(stack)/trip-detail/${tourId}`);
            console.log("✅ Custom scheme navigation to trip-detail:", tourId);
            return;
          }
        }

        // Kiểm tra nếu URL có path-based routing
        if (url.includes("/(stack)/trip-detail/")) {
          const tourId = url.split("/(stack)/trip-detail/")[1];
          if (tourId) {
            router.push(`/(stack)/trip-detail/${tourId}`);
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
            router.push(`/(stack)/trip-detail/${tourId}`);
            console.log("✅ Query-based navigation to trip-detail:", tourId);
            return;
          }
        } catch (parseError) {
          console.log("URL parse failed, trying fallback");
        }

        // Fallback về home screen
        router.push("/(tabs)/home");
        console.log("🏠 Fallback to home");
      } catch (error) {
        console.error("❌ Lỗi parse deeplink:", error);
        // Fallback về home screen
        router.push("/(tabs)/home");
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
