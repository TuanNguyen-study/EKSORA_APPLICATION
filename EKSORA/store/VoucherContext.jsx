import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getPromotion,
  saveUserVoucher,
  getVouchersByUserId,
} from "../API/services/servicesPromotion";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tạo Context với các giá trị mặc định
const VoucherContext = createContext({
  coupons: [],
  loading: false,
  fetchPromotions: () => {},
  saveVoucher: async () => {},
  handleLogout: () => {},
});

export const VoucherProvider = ({ children }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm lấy danh sách ưu đãi
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("USER_ID");

      // Nếu không có userId, dọn dẹp và dừng
      if (!userId) {
        console.log("No userId found, clearing coupons");
        setCoupons([]);
        setLoading(false);
        return;
      }

      const [allPromotionsResponse, savedVouchersResponse] = await Promise.all([
        getPromotion(),
        getVouchersByUserId(userId),
      ]);

      const savedVoucherData = savedVouchersResponse || [];
      const savedIds = savedVoucherData
        .map((savedVoucher) => savedVoucher.voucher_id?._id)
        .filter(Boolean);
      const allPromotionsData =
        allPromotionsResponse?.data || allPromotionsResponse || [];

      console.log("All promotions:", allPromotionsData.length);
      console.log("Saved vouchers:", savedIds.length);

      // Lọc ra những voucher còn hạn sử dụng (chưa qua ngày hôm nay)
      const now = new Date();
      const validPromotions = allPromotionsData.filter((item) => {
        if (!item.end_date) return true; // Nếu không có ngày hết hạn thì vẫn hiển thị
        return new Date(item.end_date) > now;
      });

      const promotions = validPromotions.map((item) => ({
        id: item._id,
        title: "Mã giảm giá",
        discount: item.discount ? `Giảm ${item.discount}%` : "Ưu đãi",
        condition: item.condition || `Áp dụng đơn từ...`,
        buttonText: "Lưu",
        isSaved: savedIds.includes(item._id), // Khởi tạo isSaved dựa trên savedIds
        expiry: item.end_date,
      }));

      console.log("All promotions (before filter):", allPromotionsData.length);
      console.log("Valid promotions (after expiry filter):", promotions.length);
      console.log(
        "All saved:",
        promotions.every((p) => p.isSaved)
      );

      setCoupons(promotions);
    } catch (error) {
      console.error("Lỗi khi tải voucher:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lưu voucher
  const saveVoucher = async (voucherId) => {
    try {
      const userId = await AsyncStorage.getItem("USER_ID");
      if (!userId) return;
      console.log("Saving voucher:", voucherId);
      await saveUserVoucher(userId, voucherId);
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === voucherId ? { ...coupon, isSaved: true } : coupon
        )
      );
    } catch (error) {
      console.log("Error saving voucher:", error.response?.data);
      if (error.response?.status === 400) {
        setCoupons((prev) =>
          prev.map((coupon) =>
            coupon.id === voucherId ? { ...coupon, isSaved: true } : coupon
          )
        );
      } else {
        alert("Đã có lỗi xảy ra khi lưu voucher.");
      }
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    console.log("Đã đăng xuất, dọn dẹp voucher state...");
    setCoupons([]);
  };

  // Tải danh sách ưu đãi khi khởi động
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Giá trị context
  const contextValue = {
    coupons,
    loading,
    saveVoucher,
    handleLogout,
    fetchPromotions,
  };

  return (
    <VoucherContext.Provider value={contextValue}>
      {children}
    </VoucherContext.Provider>
  );
};

export const useVoucher = () => useContext(VoucherContext);
