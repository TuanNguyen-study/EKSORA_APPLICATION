import axios from "axios";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ZaloPayQRPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const qrUrl = params.checkoutUrl || params.zalo_url;
  const appTransId = params.appTransId || params.orderCode || params.order_code;

  const [statusMessage, setStatusMessage] = useState();
  const formatCurrency = (value) => {
    if (!value) return "0 VND";
    return Number(value).toLocaleString("vi-VN") + " VND";
  };

  const shortenText = (text, start = 6, end = 4) => {
    if (!text) return "";
    if (text.length <= start + end) return text;
    return text.substring(0, start) + "..." + text.substring(text.length - end);
  };

  const formatDateVN = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTimeVN = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };
  // ✅ Lấy động dữ liệu từ params
  const accountInfo = {
    bankName: "Quét mã bằng ZaloPay",
    owner: "VO HUYNH TUAN ANH",
    amount: formatCurrency(params.amount),
    content: params.description || "EKSORA thanh toán", // ✅ lấy description
    orderCode: params.orderCode || "Không rõ mã đơn hàng", // ✅ camelCase
    expireAt: params.expireAt || "Không rõ hạn thanh toán",
  };

  // Copy helper
  const handleCopy = (text) => {
    Clipboard.setString(text);
    Alert.alert("Đã sao chép", text);
  };

  // --- Query trạng thái ---
useEffect(() => {
  console.log("📌 useEffect chạy với qrUrl:", qrUrl, " appTransId:", appTransId);

  if (!qrUrl) {
    console.warn("⚠️ Không có qrUrl => quay lại");
    router.back();
    return;
  }

  let interval;
  if (appTransId) {
    console.log("✅ Có appTransId, bắt đầu setInterval query...");

    interval = setInterval(async () => {
      try {
        console.log("🔍 Gửi request query trạng thái:", appTransId);

        const res = await axios.get("http://160.250.246.76:3000/api/zalo-pay/query", {
          params: { appTransId },
        });

        console.log("📩 Response trả về:", res.data);

        const data = res.data;
        const returnCode = data.raw?.return_code ?? data.return_code;
        const subReturnCode = data.raw?.sub_return_code ?? data.sub_return_code;

        console.log("👉 returnCode:", returnCode, "| subReturnCode:", subReturnCode);

        if (returnCode === 1 && subReturnCode === 1) {
          clearInterval(interval);
          console.log("🎉 Thanh toán thành công, điều hướng /return");
          setStatusMessage("✅ Thanh toán thành công!");
          router.replace("/return");
        } else if (returnCode === 2 && subReturnCode === -401) {
          console.log("⏳ Giao dịch đang chờ thanh toán...");
          setStatusMessage("⏳ Chờ thanh toán...");
        } else if (returnCode === 3) {
          console.log("⌛ Vui lòng mở ZaloPay và quét QR");
          setStatusMessage("⌛ Vui lòng mở ZaloPay và quét QR");
        } else {
          clearInterval(interval);
          console.log("❌ Thanh toán thất bại, điều hướng /cancel");
          setStatusMessage("❌ Thanh toán thất bại");
          router.replace("/cancel");
        }
      } catch (err) {
        console.error("❌ Lỗi query ZaloPay:", err.message);
        setStatusMessage("❌ Lỗi kết nối, thử lại sau");
      }
    }, 3000);
  } else {
    console.warn("⚠️ Không có appTransId => không query được");
  }

  return () => {
    console.log("🧹 Clear interval khi unmount");
    interval && clearInterval(interval);
  };
}, [qrUrl, appTransId]);



  return (

    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* --- HEADER --- */}
        <View
          style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 0,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 2,
          }}
        >
          {/* Logo row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../../../assets/images/ChatGPT Image May 8, 2025, 01_51_11 PM.png")}
              style={{ width: 40, height: 40, resizeMode: "contain" }}
            />
            <Image
              source={require("../../../../assets/images/a4456c70a348cced98601a00e4050ca1.jpg")}
              style={{ width: 60, height: 40, resizeMode: "contain" }}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 30,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 10, color: "#000" }}>
            Thanh toán trước {formatDateVN(new Date())}
          </Text>
          <Text style={{ fontSize: 10, color: "#000" }}>
            {formatTimeVN(new Date())}
          </Text>
        </View>

        {/* --- BODY --- */}
        <View style={{ paddingHorizontal: 12 }}>
          <View
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 0,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            {/* Hướng dẫn trước QR */}
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={{ textAlign: "center", fontSize: 13, color: "#333" }}>
                💡 Mở App ZaloPay để{" "}
                <Text style={{ fontWeight: "700" }}>quét mã thanh toán</Text> hoặc{" "}
                <Text style={{ fontWeight: "700" }}>chuyển khoản</Text> chính xác số tiền, nội dung bên dưới
              </Text>
            </View>

            {/* QR */}
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Image
                source={require("../../../../assets/images/download.png")}
                style={{
                  width: 80,
                  height: 80,
                  resizeMode: "contain",
                  marginBottom: 0, // khoảng cách nhỏ giữa logo và QR
                }}
              />
              {qrUrl ? (
                <QRCode value={qrUrl} size={180} />
              ) : (
                <Text>Không tìm thấy QR Code</Text>
              )}
            </View>

            {/* Thông tin thanh toán */}
            <RowCopy label="Mã thanh toán" value={accountInfo.orderCode} onCopy={handleCopy} />
            <RowCopy label="Số tiền" value={accountInfo.amount} onCopy={handleCopy} />
            <RowCopy label="Nội dung" value={accountInfo.content} onCopy={handleCopy} />

            {/* Lưu ý */}
            <Text
              style={{
                marginTop: 10,
                fontSize: 14,
                textAlign: "center",
                color: "#333",
              }}
            >
              Lưu ý: Nhập chính xác{" "}
              <Text style={{ fontWeight: "700", color: "#000" }}>
                số tiền {accountInfo.amount}
              </Text>
              ,{" "}
              <Text style={{ fontWeight: "700", color: "#000" }}>
                nội dung {accountInfo.content}
              </Text>{" "}
              khi chuyển khoản
            </Text>

            <View style={{ alignItems: "center", marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => router.replace("/cancel")}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  paddingVertical: 10,
                  paddingHorizontal: 40,
                  borderRadius: 8,
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ color: "#333", fontSize: 16, fontWeight: "600" }}>
                  Hủy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Trạng thái */}
        <Text
          style={{
            marginTop: 20,
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {statusMessage}
        </Text>
      </ScrollView>

    </View >

  );

}

// Component row + copy
function RowCopy({ label, value, fullValue, onCopy }) {
  return (
    <View
      style={{
        marginVertical: 0,
        padding: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
      }}
    >
      {/* Label */}
      <Text style={{ fontSize: 15, fontWeight: "500", marginBottom: 6 }}>
        {label}
      </Text>

      {/* Value + Nút copy cùng hàng */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#000000",
          }}
        >
          {value}
        </Text>

        <TouchableOpacity
          onPress={() => onCopy(fullValue || value)}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 6,
            backgroundColor: "rgba(0,200,100,0.08)", // xanh nhạt như ảnh mẫu
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#444", fontWeight: "600", fontSize: 14 }}>
            Sao chép
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


