import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { COLORS } from "../constants/colors";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: COLORS.success,
        height: 55, // giảm chiều cao
        alignItems: "flex-start",
        paddingVertical: 8, // thêm padding đều, nhỏ hơn
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        justifyContent: "center",
        paddingTop: 2, // giảm khoảng cách top
      }}
      text1Style={{
        fontSize: 15, // nhỏ hơn xíu
        fontWeight: "600",
        textAlign: "left",
      }}
      text2Style={{
        fontSize: 13,
        textAlign: "left",
        marginTop: 2, // ít khoảng cách hơn
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "red",
        height: 55, // giảm chiều cao
        alignItems: "flex-start",
        paddingVertical: 8,
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
