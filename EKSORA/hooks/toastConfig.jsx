import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { COLORS } from "../constants/colors";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: COLORS.success,
        height: 55,
        alignItems: "flex-start",
        paddingVertical: 8,
        position: "absolute",
        top: 60,
        left: 20,
        right: 0,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        justifyContent: "center",
        paddingTop: 2,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
        textAlign: "left",
      }}
      text2Style={{
        fontSize: 13,
        textAlign: "left",
        marginTop: 2,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "red",
        height: 55,
        alignItems: "flex-start",
        paddingVertical: 8,
        position: "absolute",
        top: 80, 
        left: 20, 
        right: 0,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        justifyContent: "center",
        paddingTop: 2,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: "600",
        textAlign: "left",
      }}
      text2Style={{
        fontSize: 13,
        textAlign: "left",
        marginTop: 2,
      }}
    />
  ),
};