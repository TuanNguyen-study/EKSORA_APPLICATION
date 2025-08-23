import React, { memo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- Bảng màu ---
const COLORS = {
  primaryBlue: "#2a6ee4ff", // Màu xanh dương chủ đạo (giống Modal)
  lightBlue: "#E6F3F9", // Nền xanh dương rất nhạt
  white: "#FFFFFF",
  textPrimary: "#1F2937", // Màu chữ chính (đen đậm)
  textSecondary: "#6B7280", // Màu chữ phụ (xám)
  border: "#E5E7EB", // Màu viền nhạt
  disabled: "#F5F5F5", // Màu nền khi loading hoặc đã lưu
};

const CouponTicket = ({
  mainTitle = "Ưu đãi đặc biệt",
  discountAmount = "N/A",
  detailsText = "",
  expiryText = "",
  status = "available",
  onToggleStatus = () => {},
  loading = false,
  requiresLogin = false,
  buttonText = "Lưu",
}) => {
  return (
    <View style={styles.container}>
      {/* ===== Dải Ribbon màu Xanh Dương ===== */}
      <View style={styles.ribbon}>
        <Ionicons name="sparkles" size={16} color={COLORS.white} />
      </View>

      <View style={styles.contentContainer}>
        {/* --- Phần thông tin chính --- */}
        <View>
          <Text style={styles.mainTitle} numberOfLines={2}>
            {mainTitle}
          </Text>
          <Text style={styles.discountText}>Giảm giá {discountAmount}</Text>
          {!!detailsText && (
            <Text style={styles.detailsText}>{detailsText}</Text>
          )}
        </View>

        {/* --- Phần chân coupon --- */}
        <View style={styles.bottomContainer}>
          <Text style={styles.expiryText}>{expiryText}</Text>

          <Pressable
            onPress={onToggleStatus}
            disabled={loading}
            style={({ pressed }) => [
              styles.actionButton,
              status === "saved"
                ? styles.savedButton
                : requiresLogin
                  ? styles.loginRequiredButton
                  : styles.defaultButton,
              loading && styles.loadingButton,
              pressed && !loading && { opacity: 0.8 },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primaryBlue} />
            ) : (
              <Text
                style={[
                  styles.actionButtonText,
                  status === "saved"
                    ? styles.savedButtonText
                    : requiresLogin
                      ? styles.loginRequiredButtonText
                      : styles.defaultButtonText,
                ]}
              >
                {status === "saved" ? "Đã lưu" : buttonText}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 16,
    marginBottom: 20,
    minHeight: 140,
    elevation: 2,
    shadowColor: "#999",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: "hidden",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  ribbon: {
    position: "absolute",
    top: -24,
    left: -24,
    width: 48,
    height: 48,
    backgroundColor: COLORS.primaryBlue,
    transform: [{ rotate: "45deg" }],
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 2,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
    width: "85%",
  },
  discountText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primaryBlue,
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  expiryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  defaultButton: {
    backgroundColor: COLORS.lightBlue,
  },
  loginRequiredButton: {
    backgroundColor: "white", // Orange color to indicate action needed
  },
  savedButton: {
    backgroundColor: COLORS.disabled,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadingButton: {
    backgroundColor: COLORS.disabled,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  defaultButtonText: {
    color: COLORS.primaryBlue,
  },
  loginRequiredButtonText: {
    color: COLORS.white,
  },
  savedButtonText: {
    color: COLORS.textSecondary,
  },
});

export default memo(CouponTicket);
