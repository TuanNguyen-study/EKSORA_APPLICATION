// services/bookingService.js
import AxiosInstance from "./AxiosInstance"; // This AxiosInstance returns full response, not intercepted

// REMOVED: updateBookingTotalPrice function - backend doesn't support PATCH /api/bookings/:id
// Relying on backup/restore mechanism instead

// API tạo booking mới
export const createBooking = async (bookingData) => {
  try {
    // Log key booking details
    const tourId = bookingData.tour_id || "Unknown";
    const userId = bookingData.user_id || "Unknown";
    console.log(
      `>>> [BOOKING SERVICE] Creating booking: User=${userId}, Tour=${tourId}, totalPrice=${bookingData.totalPrice}`
    );

    // Add error handling for missing required fields
    const requiredFields = [
      "user_id",
      "tour_id",
      "travel_date",
      "quantity_nguoiLon",
      "totalPrice",
    ];
    const missingFields = requiredFields.filter((field) => !bookingData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`);
    }

    // Ensure totalPrice is a valid number
    if (
      typeof bookingData.totalPrice !== "number" ||
      bookingData.totalPrice <= 0
    ) {
      throw new Error(
        `totalPrice phải là số dương hợp lệ. Hiện tại: ${bookingData.totalPrice} (${typeof bookingData.totalPrice})`
      );
    }

    // Ensure numeric fields are properly formatted
    const processedBookingData = {
      ...bookingData,
      totalPrice: Number(bookingData.totalPrice),
      quantity_nguoiLon: Number(bookingData.quantity_nguoiLon),
      quantity_treEm: Number(bookingData.quantity_treEm || 0),
      discount: Number(bookingData.discount || 0),
      coin: Number(bookingData.coin || 0),
    };

    console.log(
      `>>> [BOOKING SERVICE] SENDING TO SERVER - totalPrice: ${processedBookingData.totalPrice} (type: ${typeof processedBookingData.totalPrice})`
    );

    const response = await AxiosInstance.post(
      "/api/bookings",
      processedBookingData
    );

    // IMPORTANT: This AxiosInstance returns full response object, so data is in response.data
    // Log detailed response for debugging totalPrice issue
    const responseId = response.data?.id || response.data?._id || "Unknown";
    const responseTotalPrice = response.data?.totalPrice || 0;
    console.log(
      `>>> [BOOKING SERVICE] SERVER RESPONSE - ID=${responseId}, totalPrice=${responseTotalPrice} (type: ${typeof responseTotalPrice})`
    );
    console.log(
      `>>> [BOOKING SERVICE] FULL SERVER RESPONSE:`,
      JSON.stringify(response.data, null, 2)
    );

    if (!response.data) {
      throw new Error("Server không trả về dữ liệu");
    }

    // Check if response.data might be a string that needs parsing
    let bookingResponse = response.data;
    if (typeof response.data === "string") {
      try {
        bookingResponse = JSON.parse(response.data);
      } catch (e) {
        console.error(">>> [BOOKING SERVICE] Failed to parse response:", e);
      }
    }

    // Look for booking ID in multiple possible locations
    const bookingId =
      bookingResponse._id ||
      bookingResponse.id ||
      bookingResponse.bookingId ||
      (bookingResponse.booking && bookingResponse.booking._id);

    if (!bookingId) {
      console.error(
        ">>> [BOOKING SERVICE] Response structure:",
        bookingResponse
      );
      throw new Error(
        "Không tìm thấy mã đơn hàng trong phản hồi. Cấu trúc phản hồi: " +
          JSON.stringify(bookingResponse, null, 2)
      );
    }

    // CRITICAL FIX: Check if server returned totalPrice=0 despite sending correct value
    const returnedTotalPrice =
      bookingResponse.totalPrice ||
      (bookingResponse.booking && bookingResponse.booking.totalPrice);
    if (!returnedTotalPrice || returnedTotalPrice === 0) {
      console.log(
        `>>> [BOOKING SERVICE] CRITICAL: Server returned totalPrice=0, but we sent ${processedBookingData.totalPrice}`
      );
      console.log(
        `>>> [BOOKING SERVICE] Backend doesn't save totalPrice correctly. Relying on backup/restore mechanism.`
      );

      // Instead of trying to update (which fails with 404), we'll rely on backup/restore mechanism
      // The backup was already saved in paymentPage, and getTrips will restore it when needed

      // Update the response data locally for immediate return
      if (bookingResponse.booking) {
        bookingResponse.booking.totalPrice = processedBookingData.totalPrice;
        bookingResponse.booking.needsRestore = true; // Flag for backup/restore system
      } else {
        bookingResponse.totalPrice = processedBookingData.totalPrice;
        bookingResponse.needsRestore = true;
      }

      console.log(
        `>>> [BOOKING SERVICE] Marked booking ${bookingId} for totalPrice restoration via backup system`
      );
    }

    // Return standardized response
    const standardizedResponse = {
      _id: bookingId,
      ...bookingResponse,
    };

    return standardizedResponse;
  } catch (error) {
    // Log detailed error information
    console.error(">>> [BOOKING SERVICE] Error details:", {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
    });

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const serverMessage =
        error.response.data?.message || error.response.data?.error;
      throw new Error(
        serverMessage || `Lỗi từ server: ${error.response.status}`
      );
    } else if (error.request) {
      // Request made but no response received
      throw new Error(
        "Không nhận được phản hồi từ server - kiểm tra kết nối mạng"
      );
    } else {
      // Error before making request
      throw new Error(error.message || "Không thể tạo đơn hàng");
    }
  }
};

// API lấy chi tiết 1 booking theo ID
export const getBookingById = async (bookingId, token) => {
  try {
    const response = await AxiosInstance.get(`/api/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(">>> [BOOKING BY ID] Raw response:", response.data);

    // Debug detailed booking info
    if (response.data.booking) {
      const booking = response.data.booking;
      const bookingId = booking.id || booking._id || "Unknown";
      const tourId = booking.tour_id?._id || booking.tour_id || "Unknown";
      console.log(
        `>>> [BOOKING BY ID] Found booking: ID=${bookingId}, Tour=${tourId}, totalPrice=${booking.totalPrice}, status=${booking.status}`
      );
    }

    // Process the booking data to ensure totalPrice exists
    let bookingData = response.data;
    if (bookingData.booking) {
      const booking = bookingData.booking;

      // If totalPrice is missing, calculate it
      if (
        !booking.totalPrice &&
        booking.tour_id &&
        (booking.quantity_nguoiLon || booking.quantity_treEm)
      ) {
        const adultPrice =
          (booking.quantity_nguoiLon || 0) * (booking.tour_id.price || 0);
        const childPrice =
          (booking.quantity_treEm || 0) * (booking.tour_id.price_child || 0);
        const calculatedTotal = adultPrice + childPrice;

        // Apply discount if available
        const finalTotal = calculatedTotal - (booking.discount || 0);

        console.log(
          `>>> [BOOKING BY ID] Calculated totalPrice for booking ${booking._id}: ${finalTotal} (was ${booking.totalPrice})`
        );

        bookingData.booking.totalPrice = finalTotal;
        bookingData.booking.calculatedPrice = true;
      }
    }

    return bookingData;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết booking:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    throw error;
  }
};

export const cancelBookingById = async (id, token) => {
  try {
    const response = await AxiosInstance.put(
      `/api/bookings/cancel/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    throw new Error(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
  }
};
