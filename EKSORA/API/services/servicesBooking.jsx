import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "./AxiosInstance";

//API lấy danh sách chuyến đi
export const getTrips = async (userId) => {
  try {
    console.log(">>> [TRIPS] Starting getTrips for user:", userId);

    const token = await AsyncStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      throw new Error("Không tìm thấy token đăng nhập");
    }

    AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await AxiosInstance.get(`/api/bookings/user/${userId}`);

    // Debug: Check totalPrice in each booking and restore if needed
    // Note: This AxiosInstance returns full response, so data is in response.data
    if (Array.isArray(response.data)) {
      console.log(`>>> [TRIPS] Found ${response.data.length} bookings`);

      for (let booking of response.data) {
        const tourId = booking.tour_id || booking.tourId || "Unknown";
        const bookingId = booking.id || booking._id || "Unknown";
        console.log(
          `>>> [TRIPS] Booking ${bookingId}: Tour=${tourId}, totalPrice=${booking.totalPrice}, status=${booking.status}`
        );

        // CRITICAL: Check if totalPrice is missing/0 and try to restore from backup
        if (
          (!booking.totalPrice || booking.totalPrice === 0) &&
          (booking.status === "completed" || booking.status === "paid")
        ) {
          console.log(
            `>>> [TRIPS] CRITICAL: Booking ${bookingId} has totalPrice=0 but status=${booking.status}. Attempting to restore...`
          );

          try {
            // Try to restore from backup using bookingId (more reliable than tourId+userId)
            const backupKey = `BACKUP_TOTALPRICE_${bookingId}`;
            const backupPrice = await AsyncStorage.getItem(backupKey);

            if (backupPrice && parseFloat(backupPrice) > 0) {
              console.log(
                `>>> [TRIPS] Found backup totalPrice: ${backupPrice} for booking ${bookingId}`
              );
              booking.totalPrice = parseFloat(backupPrice);
              booking.restoredPrice = true; // Flag to indicate this was restored
              console.log(
                `>>> [TRIPS] Restored totalPrice for booking ${bookingId}: ${booking.totalPrice}`
              );

              // Clean up backup after successful restore
              try {
                await AsyncStorage.removeItem(backupKey);
                console.log(
                  `>>> [TRIPS] Cleaned up backup for booking ${bookingId}`
                );
              } catch (cleanupError) {
                console.warn(
                  `>>> [TRIPS] Failed to cleanup backup for booking ${bookingId}:`,
                  cleanupError
                );
              }
            } else {
              console.warn(
                `>>> [TRIPS] No backup totalPrice found for booking ${bookingId}`
              );

              // FALLBACK: Try to calculate totalPrice from tour data
              if (
                booking.tour_id &&
                (booking.quantity_nguoiLon || booking.quantity_treEm)
              ) {
                const tourPrice = booking.tour_id.price || 0;
                const adults = booking.quantity_nguoiLon || 0;
                const children = booking.quantity_treEm || 0;
                const discount = booking.discount || 0;

                if (tourPrice > 0) {
                  const calculatedTotal =
                    (adults + children) * tourPrice - discount;
                  if (calculatedTotal > 0) {
                    console.log(
                      `>>> [TRIPS] Calculated totalPrice for booking ${bookingId}: ${calculatedTotal} (${adults}+${children}) × ${tourPrice} - ${discount}`
                    );
                    booking.totalPrice = calculatedTotal;
                    booking.calculatedPrice = true;
                  }
                }
              }
            }
          } catch (restoreError) {
            console.error(
              `>>> [TRIPS] Failed to restore totalPrice for booking ${bookingId}:`,
              restoreError
            );
          }
        }
      }
    }

    if (!Array.isArray(response.data)) {
      console.error(">>> [TRIPS] Invalid response format:", response.data);
      throw new Error("Dữ liệu không hợp lệ từ server");
    }

    return response.data;
  } catch (error) {
    console.error(">>> [TRIPS] Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || "Không thể tải danh sách chuyến đi"
    );
  }
};
