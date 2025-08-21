import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../API/services/authSlice";

/**
 * Hook để tự động đăng xuất khi app khởi chạy
 */
export const useAutoLogout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const performAutoLogout = async () => {
      try {
        console.log("🚀 App đang khởi chạy - Thực hiện đăng xuất tự động...");

        // Lấy thông tin user hiện tại trước khi xóa (để log)
        const currentUserId = await AsyncStorage.getItem("USER_ID");
        const currentToken = await AsyncStorage.getItem("ACCESS_TOKEN");

        if (currentUserId || currentToken) {
          console.log("📱 Tìm thấy session cũ, đang xóa...");
          console.log("User ID:", currentUserId);
          console.log("Token exists:", !!currentToken);
        }

        // Xóa tất cả dữ liệu authentication
        const keysToRemove = [
          "ACCESS_TOKEN",
          "USER_ID",
          "USER_DATA",
          "LOCAL_AVATAR_URI",
          "REFRESH_TOKEN",
          "REMEMBER_ME",
          "LAST_LOGIN",
        ];

        await AsyncStorage.multiRemove(keysToRemove);

        // Dispatch logout action để clear Redux store
        dispatch(logout());

        console.log("✅ Đăng xuất tự động hoàn tất - App đã sạch session");

        // Có thể thêm các action khác nếu cần
        // Ví dụ: clear cache, reset app state, etc.
      } catch (error) {
        console.error("❌ Lỗi khi thực hiện đăng xuất tự động:", error);
      }
    };

    // Thực hiện đăng xuất ngay lập tức
    performAutoLogout();
  }, []); // Dependency array rỗng để chỉ chạy một lần

  return null; // Hook này không return gì
};

export default useAutoLogout;
