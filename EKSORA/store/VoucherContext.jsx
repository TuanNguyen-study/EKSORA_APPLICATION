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

      // Luôn lấy danh sách tất cả voucher, bất kể có userId hay không
      const allPromotionsResponse = await getPromotion();
      const allPromotionsData =
        allPromotionsResponse?.data || allPromotionsResponse || [];

      // Nếu có userId, lấy danh sách voucher đã lưu
      let savedIds = [];
      if (userId) {
        try {
          const savedVouchersResponse = await getVouchersByUserId(userId);
          const savedVoucherData = savedVouchersResponse || [];
          savedIds = savedVoucherData
            .map((savedVoucher) => savedVoucher.voucher_id?._id)
            .filter(Boolean);
          // console.log("Saved vouchers:", savedIds.length);
        } catch (error) {
          // console.log("Error fetching saved vouchers:", error);
        }
      } else {
        // console.log(
        //   "No userId found, showing all vouchers without saved status"
        // );
      }

      // console.log("All promotions:", allPromotionsData.length);

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
        buttonText: userId ? "Lưu" : "Đăng nhập để lưu", // Thay đổi text button khi chưa đăng nhập
        isSaved: userId ? savedIds.includes(item._id) : false, // Chỉ hiển thị saved status khi có userId
        expiry: item.end_date,
        requiresLogin: !userId, // Thêm flag để biết có cần đăng nhập không
      }));

      // console.log("All promotions (before filter):", allPromotionsData.length);
      // console.log("Valid promotions (after expiry filter):", promotions.length);
      // console.log("User logged in:", !!userId);

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
      if (!userId) {
        // Nếu chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
        alert("Vui lòng đăng nhập để lưu voucher này!");
        return;
      }
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

  // Lắng nghe thay đổi trong AsyncStorage để update khi user login/logout
  useEffect(() => {
    const checkAuthChange = async () => {
      const currentUserId = await AsyncStorage.getItem("USER_ID");
      // Chỉ re-fetch nếu có thay đổi trong authentication state
      if (currentUserId !== null) {
        fetchPromotions();
      }
    };

    // Thiết lập interval để kiểm tra thay đổi auth state
    const authCheckInterval = setInterval(checkAuthChange, 2000);

    return () => clearInterval(authCheckInterval);
  }, []);

  // Giá trị context
  const contextValue = {
    coupons,
    loading,
    saveVoucher,
    handleLogout,
    fetchPromotions,
    refetchPromotions: fetchPromotions, // Alias để gọi từ bên ngoài
  };

  return (
    <VoucherContext.Provider value={contextValue}>
      {children}
    </VoucherContext.Provider>
  );
};

export const useVoucher = () => useContext(VoucherContext);
