// File: store/VoucherContext.js

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  getPromotion,
  saveUserVoucher,
  getVouchersByUserId,
} from "../API/services/servicesPromotion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const VoucherContext = createContext({
  coupons: [],
  loading: false,
  fetchPromotions: () => {},
  saveVoucher: async () => {},
  handleLogout: () => {},
  refetchPromotions: () => {},
});

export const VoucherProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  // State để lưu trữ ID người dùng mà context "biết", dùng để so sánh thay đổi
  const [knownUserId, setKnownUserId] = useState(undefined); // undefined: chưa check, null: đã check & ko có, string: đã check & có

  // Dùng useCallback để "đóng băng" các hàm, tránh tạo lại không cần thiết
  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("USER_ID");

      const allPromotionsResponse = await getPromotion();
      const allPromotionsData =
        allPromotionsResponse?.data || allPromotionsResponse || [];

      let savedIds = [];
      if (userId) {
        try {
          const savedVouchersResponse = await getVouchersByUserId(userId);
          const savedVoucherData = savedVouchersResponse || [];
          savedIds = savedVoucherData
            .map((savedVoucher) => savedVoucher.voucher_id?._id)
            .filter(Boolean);
        } catch (error) {
          console.log("Error fetching saved vouchers:", error);
        }
      }

      const now = new Date();
      const validPromotions = allPromotionsData.filter((item) => {
        if (!item.end_date) return true;
        return new Date(item.end_date) > now;
      });

      const promotions = validPromotions.map((item) => ({
        id: item._id,
        title: "Mã giảm giá",
        discount: item.discount ? `Giảm ${item.discount}%` : "Ưu đãi",
        condition: item.condition || `Áp dụng đơn từ...`,
        buttonText: userId ? "Lưu" : "Đăng nhập để lưu",
        isSaved: userId ? savedIds.includes(item._id) : false,
        expiry: item.end_date,
        requiresLogin: !userId,
      }));

      setCoupons(promotions);
    } catch (error) {
      console.error("Lỗi khi tải voucher:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveVoucher = useCallback(async (voucherId) => {
    try {
      const userId = await AsyncStorage.getItem("USER_ID");
      if (!userId) {
        Toast.show({
          type: "error",
          text1: "Thông báo",
          text2: "Vui lòng đăng nhập để lưu voucher này!",
        });
        return;
      }
      await saveUserVoucher(userId, voucherId);
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === voucherId ? { ...coupon, isSaved: true } : coupon
        )
      );
    } catch (error) {
      if (error.response?.status === 400) {
        setCoupons((prev) =>
          prev.map((coupon) =>
            coupon.id === voucherId ? { ...coupon, isSaved: true } : coupon
          )
        );
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Đã có lỗi xảy ra khi lưu voucher.",
        });
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCoupons([]);
    setKnownUserId(null); // Khi logout, cập nhật knownUserId thành null
  }, []);

  // useEffect này chỉ chạy 1 lần khi Provider được mount
  // Để lấy trạng thái đăng nhập ban đầu và fetch dữ liệu
  useEffect(() => {
    const initialize = async () => {
      const initialUserId = await AsyncStorage.getItem("USER_ID");
      setKnownUserId(initialUserId); // Cập nhật trạng thái ban đầu
      fetchPromotions();
    };
    initialize();
  }, [fetchPromotions]);

  // useEffect này dùng để lắng nghe sự thay đổi trạng thái đăng nhập/đăng xuất
  // bằng cách polling (kiểm tra định kỳ) AsyncStorage.
  useEffect(() => {
    const checkAuthChange = async () => {
      const latestUserId = await AsyncStorage.getItem("USER_ID");

      // **LOGIC QUAN TRỌNG ĐÃ SỬA LẠI:**
      // Chỉ fetch lại dữ liệu khi trạng thái đăng nhập THỰC SỰ THAY ĐỔI
      // (ví dụ: từ null -> có ID, hoặc từ có ID -> null)
      if (latestUserId !== knownUserId) {
        console.log(
          `Phát hiện thay đổi đăng nhập: từ '${knownUserId}' sang '${latestUserId}'. Tải lại voucher...`
        );
        setKnownUserId(latestUserId); // Cập nhật trạng thái mới
        fetchPromotions(); // Gọi fetch để lấy dữ liệu mới
      }
    };

    // Thiết lập kiểm tra mỗi 3 giây (có thể điều chỉnh)
    const authCheckInterval = setInterval(checkAuthChange, 3000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(authCheckInterval);
  }, [knownUserId, fetchPromotions]); // Chạy lại effect nếu knownUserId thay đổi

  // Dùng useMemo để "đóng băng" object contextValue
  const contextValue = useMemo(
    () => ({
      coupons,
      loading,
      saveVoucher,
      handleLogout,
      fetchPromotions,
      refetchPromotions: fetchPromotions,
    }),
    [coupons, loading, saveVoucher, handleLogout, fetchPromotions]
  );

  return (
    <VoucherContext.Provider value={contextValue}>
      {children}
    </VoucherContext.Provider>
  );
};

export const useVoucher = () => useContext(VoucherContext);