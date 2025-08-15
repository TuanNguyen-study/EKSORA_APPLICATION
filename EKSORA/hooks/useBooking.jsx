import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { createBooking } from "../API/services/booking";
import { useRouter } from "expo-router";
import { useCart } from "../store/CartContext";

/**
 * Hàm tiện ích: Định dạng một số thành chuỗi tiền tệ Việt Nam (VND).
 * @param {number} price - Số tiền cần định dạng.
 * @returns {string} - Chuỗi đã định dạng, ví dụ: "1.200.000 ₫".
 */
const formatPrice = (price) => {
  const value = typeof price === "number" ? price : 0;
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

/**
 * Hàm tiện ích: Chuyển đổi chuỗi ngày tháng (DD/MM/YYYY) thành dạng timestamp.
 * Hữu ích cho việc so sánh, sắp xếp ngày tháng.
 * @param {string} dateStr - Chuỗi ngày tháng dạng "DD/MM/YYYY".
 * @returns {number} - Timestamp (miliseconds).
 */
const parseDateString = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`).getTime();
};

// --- ĐỊNH NGHĨA CUSTOM HOOK: useBooking ---
// Hook này đóng gói toàn bộ logic của màn hình đặt tour.
export const useBooking = (initialDetails) => {
  // --- LẤY DỮ LIỆU TỪ CONTEXT VÀ REDUX ---
  const { addToCart, cartItems } = useCart(); // Lấy hàm thêm vào giỏ hàng và danh sách sản phẩm trong giỏ
  const router = useRouter(); // Lấy đối tượng router để điều hướng
  const user = useSelector((state) => state.auth.user); // Lấy thông tin người dùng đang đăng nhập từ Redux
  const { id: userId, firstName, lastName, email, phone } = user || {}; // Trích xuất thông tin chi tiết của người dùng
  const fullName = `${firstName || ""} ${lastName || ""}`.trim(); // Tạo tên đầy đủ từ họ và tên

  // --- KHAI BÁO CÁC STATE (TRẠNG THÁI) CỦA COMPONENT ---
  const [tourData, setTourData] = useState(null); // Lưu thông tin cơ bản của tour
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // Trạng thái ẩn/hiện của bảng chọn ngày
  const [selectedDate, setSelectedDate] = useState(null); // Ngày khởi hành được chọn
  const [quantityAdult, setQuantityAdult] = useState(0); // Số lượng người lớn
  const [quantityChild, setQuantityChild] = useState(0); // Số lượng trẻ em
  const [originalPrices, setOriginalPrices] = useState({ adult: 0, child: 0 }); // Lưu giá GỐC (chưa giảm giá)
  const [displayPrices, setDisplayPrices] = useState({ adult: 0, child: 0 }); // Lưu giá HIỂN THỊ (có thể đã áp dụng giảm giá)
  const [appliedVoucher, setAppliedVoucher] = useState(null); // Voucher đang được áp dụng
  const [discountAmount, setDiscountAmount] = useState(0); // Số tiền được giảm giá
  const [finalPrice, setFinalPrice] = useState(0); // Tổng tiền cuối cùng phải trả
  const [availableDates, setAvailableDates] = useState([]); // Danh sách các ngày có thể chọn

  // --- KHỞI TẠO DỮ LIỆU BAN ĐẦU KHI COMPONENT ĐƯỢC TẠO ---
  // useEffect này chỉ chạy một lần khi `initialDetails` (thông tin tour) được truyền vào.
  useEffect(() => {
    if (initialDetails) {
      // Lấy giá người lớn làm giá cơ sở
      const adultBasePrice = initialDetails.total_price || 0;
      // TÍNH GIÁ TRẺ EM = 70% GIÁ NGƯỜI LỚN
      const childBasePrice = adultBasePrice * 0.7;

      // Thiết lập thông tin tour
      setTourData({
        tour_id: initialDetails.tour_id,
        tour_title: initialDetails.tour_title,
        image: initialDetails.image,
        selectedOptions: initialDetails.selectedOptions,
        selectedOptionsDetails: initialDetails.selectedOptionsDetails,
      });

      // Thiết lập giá gốc và giá hiển thị ban đầu
      setOriginalPrices({ adult: adultBasePrice, child: childBasePrice });
      setDisplayPrices({ adult: adultBasePrice, child: childBasePrice });

      // Reset các giá trị về mặc định
      setQuantityAdult(0);
      setQuantityChild(0);
      setAppliedVoucher(null);
      setDiscountAmount(0);

      // Tạo một danh sách 30 ngày khởi hành kể từ hôm nay
      const today = new Date();
      const dates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      });
      setAvailableDates(dates);

      // Tự động chọn ngày hôm nay làm ngày mặc định
      if (dates.length > 0) {
        setSelectedDate(dates[0]);
      }
    }
  }, [initialDetails]); // Phụ thuộc vào `initialDetails`

  // --- HÀM XỬ LÝ ÁP DỤNG VOUCHER ---
  // useCallback để tối ưu, tránh tạo lại hàm mỗi lần render.
  const applyVoucher = useCallback(
    (voucher) => {
      // 1. Trường hợp người dùng gỡ voucher
      if (!voucher) {
        setAppliedVoucher(null);
        Alert.alert("Đã bỏ áp dụng", "Voucher đã được gỡ bỏ.");
        return;
      }

      // 2. Kiểm tra voucher có hợp lệ không
      if (!voucher?.voucher_id?.min_order_value) {
        Alert.alert(
          "Lỗi voucher",
          "Voucher này không hợp lệ hoặc thiếu thông tin quan trọng."
        );
        return;
      }

      // 3. Tính tổng giá trị đơn hàng hiện tại (dựa trên giá gốc)
      const totalBeforeDiscount =
        originalPrices.adult * quantityAdult +
        originalPrices.child * quantityChild;

      const minOrderValue = voucher.voucher_id.min_order_value;

      // 4. Kiểm tra xem đơn hàng có đủ điều kiện giá trị tối thiểu không
      if (totalBeforeDiscount < minOrderValue) {
        Alert.alert(
          "Không đủ điều kiện",
          `Rất tiếc, voucher này chỉ áp dụng cho đơn hàng có giá trị từ ${formatPrice(minOrderValue)} trở lên.`,
          [{ text: "Đã hiểu" }]
        );
        return;
      }

      // 5. Nếu mọi thứ OK, lưu voucher vào state
      setAppliedVoucher(voucher);
      Alert.alert("Thành công", "Đã áp dụng voucher!");
    },
    [originalPrices, quantityAdult, quantityChild]
  ); // Phụ thuộc vào các giá trị này

  // --- TÍNH TOÁN LẠI MỌI THỨ KHI CÓ THAY ĐỔI VỀ SỐ LƯỢNG HOẶC VOUCHER ---
  // useEffect này là "bộ não" tính toán của hook.
  useEffect(() => {
    const totalBeforeDiscount =
      originalPrices.adult * quantityAdult +
      originalPrices.child * quantityChild;

    // TRƯỜNG HỢP 1: Không có voucher hoặc voucher không hợp lệ
    if (
      !appliedVoucher ||
      !appliedVoucher.voucher_id ||
      typeof appliedVoucher.voucher_id.discount === "undefined"
    ) {
      setDiscountAmount(0); // Không giảm giá
      setDisplayPrices(originalPrices); // Giá hiển thị bằng giá gốc
      setFinalPrice(totalBeforeDiscount); // Tổng tiền bằng tổng giá gốc
      return;
    }

    // TRƯỜNG HỢP 2: Số lượng thay đổi làm tổng tiền không còn đủ điều kiện voucher
    if (totalBeforeDiscount < appliedVoucher.voucher_id.min_order_value) {
      setAppliedVoucher(null); // Tự động gỡ voucher
      setDiscountAmount(0);
      setDisplayPrices(originalPrices);
      setFinalPrice(totalBeforeDiscount);
      // Thông báo cho người dùng (có thể thêm Alert ở đây nếu muốn)
      return;
    }

    // TRƯỜNG HỢP 3: Tính toán giảm giá khi có voucher hợp lệ
    let calculatedDiscount = 0;
    // Xác định loại voucher: 'percentage' (phần trăm) hoặc 'fixed_amount' (số tiền cố định)
    let voucherType = appliedVoucher.voucher_id.discount_type
      ? appliedVoucher.voucher_id.discount_type.toLowerCase()
      : "";
    const discountValue = appliedVoucher.voucher_id.discount;

    // Tự suy luận loại voucher nếu không được cung cấp rõ ràng
    if (!voucherType) {
      if (discountValue > 0 && discountValue <= 100) voucherType = "percentage";
      else voucherType = "fixed_amount";
    }

    // Tính số tiền giảm giá
    if (voucherType === "percentage") {
      calculatedDiscount = totalBeforeDiscount * (discountValue / 100);
      // Kiểm tra xem số tiền giảm có vượt quá mức tối đa cho phép không
      if (appliedVoucher.voucher_id.max_discount_value) {
        calculatedDiscount = Math.min(
          calculatedDiscount,
          appliedVoucher.voucher_id.max_discount_value
        );
      }
    } else {
      // 'fixed_amount'
      calculatedDiscount = discountValue;
    }

    // Đảm bảo số tiền giảm không lớn hơn tổng giá trị đơn hàng
    calculatedDiscount = Math.min(calculatedDiscount, totalBeforeDiscount);
    setDiscountAmount(calculatedDiscount);

    // Phân bổ tiền giảm giá cho vé người lớn và trẻ em theo tỷ lệ
    let newAdultPrice = originalPrices.adult;
    let newChildPrice = originalPrices.child;

    if (totalBeforeDiscount > 0) {
      const discountRatio = calculatedDiscount / totalBeforeDiscount; // Tỷ lệ giảm giá
      newAdultPrice = originalPrices.adult * (1 - discountRatio);
      newChildPrice = originalPrices.child * (1 - discountRatio);
    }

    // Đảm bảo giá không bị âm
    newAdultPrice = Math.max(newAdultPrice, 0);
    newChildPrice = Math.max(newChildPrice, 0);

    // Cập nhật lại giá hiển thị và tổng tiền cuối cùng
    setDisplayPrices({ adult: newAdultPrice, child: newChildPrice });
    setFinalPrice(totalBeforeDiscount - calculatedDiscount);
  }, [quantityAdult, quantityChild, originalPrices, appliedVoucher]); // Chạy lại mỗi khi các giá trị này thay đổi

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN (EVENT HANDLERS) ---
  const incrementAdult = () => setQuantityAdult((q) => q + 1);
  const decrementAdult = () => setQuantityAdult((q) => (q > 0 ? q - 1 : 0));
  const incrementChild = () => setQuantityChild((q) => q + 1);
  const decrementChild = () => setQuantityChild((q) => (q > 0 ? q - 1 : 0));

  // Xử lý khi người dùng xác nhận chọn ngày từ DatePicker
  const handleConfirmDate = (date) => {
    setDatePickerVisible(false); // Ẩn bảng chọn ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 0 để so sánh chỉ ngày
    // Không cho phép chọn ngày trong quá khứ
    if (date < today) {
      Alert.alert(
        "Ngày không hợp lệ",
        "Bạn không thể đặt lịch cho một ngày trong quá khứ. Vui lòng chọn lại."
      );
      return;
    }
    const formatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setSelectedDate(formatted);
    // Nếu ngày được chọn (ví dụ từ calendar) không có trong danh sách có sẵn, thêm nó vào và sắp xếp lại
    if (!availableDates.includes(formatted)) {
      setAvailableDates((prev) => {
        const newDates = [formatted, ...prev.filter((d) => d !== formatted)];
        newDates.sort((a, b) => parseDateString(a) - parseDateString(b));
        return newDates;
      });
    }
  };

  // Xử lý khi người dùng nhấn nút "Thêm vào giỏ hàng"

  const handleAddToCart = () => {
    // Kiểm tra số lượng
    if (quantityAdult === 0 && quantityChild === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn số lượng người lớn hoặc trẻ em.");
      return;
    }
    if (!tourData) return;

    // Tạo ID duy nhất cho sản phẩm trong giỏ hàng để tránh trùng lặp
    const cartItemId = `${tourData.tour_id}_${selectedDate}`;
    if (cartItems.find((item) => item.id === cartItemId)) {
      Alert.alert(
        "Thông báo",
        "Tour này với ngày đã chọn đã có trong giỏ hàng."
      );
      return;
    }

    // TẠO ĐỐI TƯỢNG SẢN PHẨM HOÀN CHỈNH - PHIÊN BẢN ĐÃ SỬA LỖI
    const cartItem = {
      id: cartItemId,
      tour_id: tourData.tour_id,
      name: tourData.tour_title,
      image: tourData.image,
      travelDate: selectedDate,
      adults: quantityAdult,
      children: quantityChild,
      adultPrice: displayPrices.adult,
      childPrice: displayPrices.child,
      originalAdultPrice: originalPrices.adult,
      originalChildPrice: originalPrices.child,
      selectedOptions: tourData.selectedOptionsDetails,
      price: finalPrice,
      originalPrice: originalPrices
        ? originalPrices.adult * quantityAdult +
          originalPrices.child * quantityChild
        : finalPrice,

      // ================================================================
      // ===== PHẦN SỬA LỖI QUAN TRỌNG NHẤT NẰM Ở ĐÂY =====
      // ================================================================
      discount: discountAmount,
      voucherCode: appliedVoucher ? appliedVoucher.voucher_id.code : null, // SỬA LẠI ĐƯỜNG DẪN
      voucherId: appliedVoucher ? appliedVoucher.voucher_id._id : null, // SỬA LẠI ĐƯỜNG DẪN

      // SỬA LẠI CẢ TÊN TRƯỜNG VÀ ĐƯỜNG DẪN CHO ĐÚNG
      end_date: appliedVoucher ? appliedVoucher.voucher_id.end_date : null,
    };

    addToCart(cartItem); // Gọi hàm từ CartContext với dữ liệu ĐẦY ĐỦ
    Alert.alert("Thành công", `Đã thêm "${tourData.tour_title}" vào giỏ hàng!`);
  };

  // Xử lý khi người dùng nhấn nút "Đặt ngay"
  const handleBooking = async () => {
    // Kiểm tra các điều kiện cần thiết
    if (quantityAdult === 0 && quantityChild === 0) {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn số lượng người lớn hoặc trẻ em để đặt tour."
      );
      return;
    }
    if (!tourData || !selectedDate || !userId) {
      Alert.alert(
        "Lỗi",
        "Dữ liệu không hợp lệ hoặc bạn chưa đăng nhập. Vui lòng thử lại."
      );
      return;
    }

    // THAY ĐỔI: Không tạo booking ngay, chỉ chuẩn bị dữ liệu và đi thẳng đến BookingCompleted
    console.log("[BOOKING] Chuẩn bị dữ liệu để đi đến BookingCompleted...");

    // Điều hướng trực tiếp tới màn hình "BookingCompleted" với dữ liệu cần thiết
    // Booking sẽ được tạo sau khi chọn hình thức thanh toán
    router.push({
      pathname: "/BookingCompleted",
      params: {
        // Không có bookingId vì chưa tạo
        title: tourData.tour_title,
        quantityAdult: quantityAdult.toString(),
        quantityChild: quantityChild.toString(),
        totalPrice: finalPrice.toString(),
        originalPrice: originalPrices
          ? (
              originalPrices.adult * quantityAdult +
              originalPrices.child * quantityChild
            ).toString()
          : finalPrice.toString(),
        discountAmount: discountAmount.toString(),
        voucherCode: appliedVoucher ? appliedVoucher.voucher_id.code : null,
        travelDate: selectedDate,
        image: tourData.image || "",
        // Thêm flag để biết đây là luồng "Đặt ngay" cần tạo booking sau
        fromDirectBooking: "true",
        // Thêm dữ liệu booking để tạo sau
        bookingData: JSON.stringify({
          user_id: userId,
          fullName,
          email,
          phone,
          tour_id: tourData.tour_id,
          travel_date: (() => {
            const [day, month, year] = selectedDate.split("/");
            return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          })(),
          quantity_nguoiLon: quantityAdult,
          quantity_treEm: quantityChild,
          price_nguoiLon: originalPrices.adult,
          price_treEm: originalPrices.child,
          optionServices: Object.values(tourData.selectedOptions).map((id) => ({
            option_service_id: id,
          })),
          coin: 0,
          voucher_id: appliedVoucher ? appliedVoucher.voucher_id._id : null,
          discount: discountAmount,
        }),
      },
    });
  };

  // --- TRẢ VỀ CÁC STATE VÀ HÀM CẦN THIẾT CHO COMPONENT UI ---
  // Component nào dùng hook này sẽ nhận được các giá trị và hàm này để hiển thị và xử lý.
  return {
    image: tourData?.image,
    tour_title: tourData?.tour_title,
    selectedOptionsDetails: tourData?.selectedOptionsDetails || [],
    availableDates,
    selectedDate,
    quantityAdult,
    quantityChild,
    adultPrice: displayPrices.adult,
    childPrice: displayPrices.child,
    discount: discountAmount,
    finalPrice,
    isDatePickerVisible,
    formatPrice, // Trả về cả hàm tiện ích
    setSelectedDate,
    setDatePickerVisible,
    handleConfirmDate,
    incrementAdult,
    decrementAdult,
    incrementChild,
    decrementChild,
    handleAddToCart,
    handleBooking,
    applyVoucher,
    appliedVoucher,
  };
};
