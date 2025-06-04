import React, { useEffect } from "react";
import { Button, Platform } from "react-native";
import { useRouter } from "expo-router";
import { FacebookAuthProvider,signInWithCredential, signInWithPopup,} from "firebase/auth";
import { auth } from "./firebaseConfig";
import * as Facebook from "expo-auth-session/providers/facebook";

export function loginWithFacebook() {
  const provider = new FacebookAuthProvider();
  return signInWithPopup(auth, provider);
}

export default function FacebookLoginButton() {
  const [ response, promptAsync] = Facebook.useAuthRequest({
    clientId: "714285671096257",
  });

  const router = useRouter();

  useEffect(() => {
  if (response?.type === "success") {
    const accessToken =
      response.authentication?.accessToken || response.authentication?.access_token;

    if (!accessToken) {
      alert("Không lấy được token");
      return;
    }

    const credential = FacebookAuthProvider.credential(accessToken);
    signInWithCredential(auth, credential) .then(() => {
        alert("Đăng nhập Facebook thành công!");
        router.replace("/(tabs)/home/index");
      })
      .catch((error) => {
        alert("Lỗi: " + error.message);
      });
  }
}, [response, router]);


  const handleLogin = async () => {
    if (Platform.OS === "web") {
      try {await loginWithFacebook();
        alert("Đăng nhập Facebook thành công!");
        router.replace("/(tabs)/home/index");
      } catch (error) { alert("Lỗi: " + error.message); }
    } else {
      promptAsync();}
  };

  return <Button title="Đăng nhập bằng Facebook" onPress={handleLogin} />;
}
