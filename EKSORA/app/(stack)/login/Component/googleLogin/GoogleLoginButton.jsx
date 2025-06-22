import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleLogin({ style, textStyle, iconStyle } = {}) {
  const router = useRouter();

 const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: "550765995121-gia9o8hdhfcp60fe1rnm224i6uvlngpv.apps.googleusercontent.com",
  iosClientId: "202826142981-f7afuh14h1dtsso6phl7ttb61qorlt6v.apps.googleusercontent.com", // ← thêm dòng này
  webClientId: "202826142981-na9784r84dlvmg91bor5e6bcumuh40ts.apps.googleusercontent.com",
  prompt: "select_account",
  redirectUri: makeRedirectUri({ useProxy: true }),
});



  const fetchUserInfo = useCallback(async (token) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      console.log("Google User:", user); // xử lý user nếu cần
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  }, [router]);

  React.useEffect(() => {
    if (response?.type === "success") {
      fetchUserInfo(response.authentication.accessToken);
    }
  }, [response, fetchUserInfo]);

  return { promptAsync, request };
}