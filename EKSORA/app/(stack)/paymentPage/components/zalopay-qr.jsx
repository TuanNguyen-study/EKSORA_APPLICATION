import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function ZaloPayQRPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const qrUrl = params.checkoutUrl;
  // 👉 Nếu server trả appTransId thì lấy theo key appTransId, còn nếu bạn để order_code thì vẫn fallback được
  const appTransId = params.appTransId || params.order_code;

  const [statusMessage, setStatusMessage] = useState("Chờ thanh toán...");

  // Log toàn bộ params khi vào màn hình
  console.log("📦 Params nhận được:", params);
  console.log("➡️ qrUrl:", qrUrl);
  console.log("➡️ appTransId:", appTransId);

  useEffect(() => {
    if (!qrUrl) {
      console.log("⚠️ Không có qrUrl → quay lại trang trước");
      router.back();
      return;
    }

    let interval;

    if (appTransId) {
      console.log("✅ Bắt đầu setInterval với appTransId:", appTransId);

      interval = setInterval(async () => {
        console.log("🔄 Gọi API query ZaloPay với appTransId =", appTransId);
        try {
          // 👉 gọi API query trạng thái
          const res = await axios.get(
            "http://160.250.246.76:3000/api/zalo-pay/query",
            { params: { appTransId } }
          );

          // 👉 log nguyên response từ server
          console.log("🔍 Kết quả query (raw):", res.data);

          const data = res.data;
          const returnCode = data.raw?.return_code ?? data.return_code;
          const subReturnCode = data.raw?.sub_return_code ?? data.sub_return_code;
          const returnMessage = data.raw?.return_message ?? data.return_message;
          const subReturnMessage = data.raw?.sub_return_message ?? data.sub_return_message;

          console.log("➡️ return_code:", returnCode);
          console.log("➡️ sub_return_code:", subReturnCode);
          console.log("➡️ return_message:", returnMessage);
          console.log("➡️ sub_return_message:", subReturnMessage);

          // --- Xử lý kết quả ---
          /**
           *  return_code === 1 && sub_return_code === 1      => thành công
           *  return_code === 2 && sub_return_code === -401   => đang chờ cập nhật
           *  ngược lại                                        => thất bại
           */
          if (returnCode === 1 && subReturnCode === 1) {
            console.log("✅ Thanh toán ZaloPay thành công!");
            clearInterval(interval);
            setStatusMessage("✅ Thanh toán thành công!");
            // Alert.alert("Thanh toán thành công!");
            router.replace("/return");
          } else if (returnCode === 2 && subReturnCode === -401) {
            console.log("⏳ Giao dịch chưa cập nhật, chờ query tiếp theo...");
            setStatusMessage("⏳ Chờ thanh toán...");
          } else if (returnCode === 3) {
            console.log("⌛ Giao dịch chưa khởi tạo (chưa quét QR)...");
            setStatusMessage("⌛ Vui lòng mở ZaloPay và quét QR");
            // 👉 Không clear interval, tiếp tục chờ user quét
          } else {
            console.log("❌ Thanh toán thất bại:", returnMessage, subReturnMessage);
            clearInterval(interval);
            setStatusMessage("❌ Thanh toán thất bại");
            // Alert.alert("Thanh toán thất bại", returnMessage || subReturnMessage);
            router.replace("/cancel");
          }
        } catch (err) {
          console.error("❌ Query error:", err);
          setStatusMessage("❌ Lỗi kết nối, thử lại sau");
        }
      }, 3000);
    } else {
      console.log("⚠️ Không có appTransId → không gọi API");
      setStatusMessage("⚠️ Không tìm thấy mã giao dịch");
    }

    // Cleanup interval
    return () => {
      if (interval) {
        console.log("🧹 Dọn interval");
        clearInterval(interval);
      }
    };
  }, [qrUrl, appTransId]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Quét mã QR bằng ZaloPay để thanh toán
      </Text>

      {qrUrl ? (
        <QRCode value={qrUrl} size={260} />
      ) : (
        <Text>Không tìm thấy QR Code</Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>{statusMessage}</Text>
      </View>
    </SafeAreaView>
  );
}
