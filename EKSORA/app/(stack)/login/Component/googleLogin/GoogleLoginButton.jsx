import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function useGoogleLogin() {
  const router = useRouter();

  // ✅ Sử dụng Expo Proxy để chạy được trên Expo Go
  const redirectUri = makeRedirectUri({
    useProxy: true
  });

  console.log("🔁 Redirect URI:", redirectUri);
  // Sẽ ra: https://auth.expo.io/@tentaikhoan/tenproject

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "202826142981-5qsfp2r4cdt65c2jpfc8c4pl9mq828te.apps.googleusercontent.com",
    iosClientId: "202826142981-f7afuh14h1dtsso6phl7ttb61qorlt6v.apps.googleusercontent.com",
    webClientId: "202826142981-na9784r84dlvmg91bor5e6bcumuh40ts.apps.googleusercontent.com",
    redirectUri,
    useProxy: true,
    scopes: ["profile", "email"],
    prompt: "select_account",
  });

  const fetchUserInfo = useCallback(async (token) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      console.log("✅ Google User:", user);
      router.replace("/(tabs)/home"); 
    } catch (error) {
      console.error(" Lỗi khi lấy thông tin người dùng:", error);
    }
  }, [router]);

  useEffect(() => {
    console.log("📱 Response:", response);
    if (response?.type === "success") {
      const token = response.authentication?.accessToken;
      if (token) fetchUserInfo(token);
    } else if (response?.type === "error") {
      console.error(" Google Login Error:", response);
    }
  }, [response, fetchUserInfo]);

  return { promptAsync, request };
}
