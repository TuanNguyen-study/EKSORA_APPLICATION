import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useRouter, useSegments } from "expo-router";

/**
 * Hook xử lý back button để điều hướng về tab home
 * @param {string} currentTab - Tab hiện tại (offers, favorites, trips, account)
 */
export const useBackToHome = (currentTab) => {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const backAction = () => {
      try {
        // Kiểm tra xem segments có dữ liệu không
        if (!segments || segments.length === 0) {
          return false; // Cho phép hành vi back mặc định nếu segments chưa ready
        }

        // Chỉ xử lý khi đang ở trong các tab chính (không phải stack screens)
        const isOnMainTab = segments.length === 2 && segments[0] === "(tabs)";
        const isNotHomeTab = currentTab && currentTab !== "home";

        if (isOnMainTab && isNotHomeTab) {
          // Thêm delay nhỏ để đảm bảo router đã sẵn sàng
          setTimeout(() => {
            try {
              router.push("/(tabs)/home");
            } catch (error) {
              console.log("Navigation error:", error);
            }
          }, 0);
          return true; // Chặn hành vi back mặc định
        }

        return false; // Cho phép hành vi back mặc định
      } catch (error) {
        console.log("BackHandler error:", error);
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [currentTab, segments, router]);
};
