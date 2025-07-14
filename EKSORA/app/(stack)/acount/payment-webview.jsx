import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { WebView } from "react-native-webview";

export default function PaymentWebview() {
  const { checkoutUrl } = useLocalSearchParams();
  const finalUrl = decodeURIComponent(checkoutUrl);
  const router = useRouter();

  if (!checkoutUrl) {
    return <View><Text>Không có link thanh toán</Text></View>;
  }

  return (
    <WebView
      source={{ uri: finalUrl }}
      startInLoadingState={true}
      renderLoading={() => <ActivityIndicator size="large" color="blue" />}
      onNavigationStateChange={nav => {
        if (nav.url.includes("success")) {
          router.replace("/acount/SuccessScreen");
        } else if (nav.url.includes("cancel")) {
         router.replace("/acount/CancelPaymentScreen");
        }
      }}
    />
  );
}
