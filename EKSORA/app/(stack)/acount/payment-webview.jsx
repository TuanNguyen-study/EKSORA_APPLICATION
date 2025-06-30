import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";

export default function PaymentWebview() {
  const { checkoutUrl } = useLocalSearchParams();
  const router = useRouter();

  return (
    <WebView
      source={{ uri: checkoutUrl }}
      onNavigationStateChange={nav => {
        if (nav.url.includes("success")) router.replace("/account/SuccessScreen");
        else if (nav.url.includes("cancel")) router.back();
      }}
    />
  );
}
