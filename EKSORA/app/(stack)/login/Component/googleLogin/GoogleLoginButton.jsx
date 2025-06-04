import React from "react";
import { Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton({ style, textStyle, iconStyle }) {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "550765995121-gia9o8hdhfcp60fe1rnm224i6uvlngpv.apps.googleusercontent.com",
    webClientId: "1072561122904-5mpleghk7m4rn7l3bl2mteg8e4eres2l.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      fetchUserInfo(response.authentication.accessToken);
    }
  }, );

  async function fetchUserInfo(token) {
    const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    router.replace("/(tabs)/home");
  }

  return (
    <TouchableOpacity
      style={style}
      disabled={!request}
      onPress={() => promptAsync()}
    >
      <Text style={textStyle}>Google</Text>
      <AntDesign name="googleplus" size={24} color="white" style={iconStyle} />
    </TouchableOpacity>
  );
}
