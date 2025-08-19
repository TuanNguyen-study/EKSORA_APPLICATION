import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../API/services/servicesProfile";
import { provinces } from "./provinces";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as validators from "../../../utils/validators";

// ===== COMPONENT CHÍNH =====
export default function PersonalInfoScreen() {
  // --- States ---
  const [userInfo, setUserInfo] = useState({
    name: "",
    title: "",
    birth: "",
    country: "",
    phoneEmail: "",
  });
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // --- Nhiệm vụ: Tải dữ liệu người dùng khi mở màn hình ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const localAvatar = await AsyncStorage.getItem("LOCAL_AVATAR_URI");
        const localBirth = await AsyncStorage.getItem("LOCAL_BIRTH");
        if (localAvatar) setAvatarUri(localAvatar);

        const token = await AsyncStorage.getItem("ACCESS_TOKEN");
        if (!token) return;

        const user = await getUserProfile(token);
        setUserInfo({
          name: user.first_name || "",
          title: user.last_name || "",
          birth: localBirth || user.birth_day || "",
          country: user.address || "",
          phoneEmail: user.phone || user.email || "",
        });
      } catch (err) {
        console.log("Lỗi khi tải dữ liệu người dùng:", err);
      }
    };
    loadData();
  }, []);

  // --- Nhiệm vụ: Mở modal tương ứng để chỉnh sửa thông tin ---
  const handleOpenModal = (field, currentValue) => {
    if (field === "phoneEmail" && currentValue.includes("@")) {
      Alert.alert(
        "Thông báo",
        "Tính năng thay đổi Email chưa được hỗ trợ. Vui lòng liên hệ bộ phận CSKH."
      );
      return;
    }

    if (field === "birth") {
      setDatePickerVisible(true);
    } else {
      setCurrentField(field);
      setTempValue(currentValue);
      setModalVisible(true);
    }
  };

  // --- Nhiệm vụ: Lưu thông tin từ modal ---
  const handleModalSave = async () => {
    let error = null;
    let valueToValidate = tempValue.trim(); // Dùng giá trị đã trim để validate

    // === BƯỚC 1: KIỂM TRA ĐẦU VÀO RỖNG ===
    if (!valueToValidate) {
      Alert.alert("Thông báo", "Vui lòng nhập thông tin.");
      return;
    }

    // === BƯỚC 2: VALIDATE DỮ LIỆU THÔ TỪ NGƯỜI DÙNG ===
    switch (currentField) {
      case "name":
        // Giả sử validateName cũng kiểm tra ký tự không hợp lệ
        error = validators.validateName(valueToValidate);
        break;
      case "title":
        error = validators.validateRequired(valueToValidate, "Danh xưng");
        break;
      case "country":
        error = validators.validateRequired(
          valueToValidate,
          "Quốc gia/Khu vực"
        );
        break;
      case "phoneEmail":
        // Validate trực tiếp đầu vào của người dùng
        error = validators.validatePhoneNumber(valueToValidate);
        break;
    }

    // === BƯỚC 3: HIỂN THỊ LỖI NẾU CÓ ===
    if (error) {
      Alert.alert("Thông báo", error);
      return; // Dừng lại ngay nếu có lỗi
    }

    // === BƯỚC 4: FORMAT DỮ LIỆU NẾU ĐÃ HỢP LỆ ===
    let valueToSave = valueToValidate; // Mặc định
    switch (currentField) {
      case "name":
        valueToSave = validators.formatName(valueToValidate);
        break;
      case "phoneEmail":
        valueToSave = validators.formatPhoneNumber(valueToValidate);
        break;
      // title và country chỉ cần trim là đủ, đã làm ở trên
    }

    // === BƯỚC 5: LƯU DỮ LIỆU NẾU KHÔNG CÓ LỖI ===
    const updatedInfo = { ...userInfo, [currentField]: valueToSave };
    setUserInfo(updatedInfo);
    setModalVisible(false);

    const token = await AsyncStorage.getItem("ACCESS_TOKEN");
    if (!token) return;

    const payload = {};
    switch (currentField) {
      case "name":
        payload.first_name = valueToSave;
        break;
      case "title":
        payload.last_name = valueToSave;
        break;
      case "country":
        payload.address = valueToSave;
        break;
      case "phoneEmail":
        payload.phone = valueToSave;
        break;
    }

    if (Object.keys(payload).length > 0) {
      try {
        await updateUserProfile(token, payload);
        // Bạn có thể bỏ comment dòng này để có thông báo thành công thực sự
        // Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
      } catch (e) {
        Alert.alert("Lỗi", "Cập nhật thất bại, vui lòng thử lại.");
        console.log("API update error:", e);
        // Rollback lại thông tin cũ nếu API lỗi
        setUserInfo(userInfo);
      }
    }
  };

  // --- Nhiệm vụ: Lưu ngày sinh sau khi chọn ---
  const handleConfirmDate = async (date) => {
    const formattedDate = date.toISOString().split("T")[0];

    const error = validators.validateBirthDate(formattedDate);
    if (error) {
      Alert.alert("Thông báo", error);
      setDatePickerVisible(false);
      return;
    }

    setDatePickerVisible(false);
    setUserInfo((prev) => ({ ...prev, birth: formattedDate }));
    await AsyncStorage.setItem("LOCAL_BIRTH", formattedDate);

    const token = await AsyncStorage.getItem("ACCESS_TOKEN");
    if (token) {
      try {
        await updateUserProfile(token, { birth_day: formattedDate });
      } catch (e) {
        Alert.alert("Lỗi", "Cập nhật ngày sinh thất bại.");
      }
    }
  };

  // --- Nhiệm vụ: Mở thư viện ảnh để chọn avatar ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Yêu cầu quyền",
        "Bạn cần cấp quyền truy cập ảnh để thay đổi ảnh đại diện."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setAvatarUri(uri);
      await AsyncStorage.setItem("LOCAL_AVATAR_URI", uri);
    }
  };

  // --- Nhiệm vụ: Lấy ngày mặc định cho DatePicker ---
  const getInitialDateForPicker = () => {
    if (userInfo.birth) {
      const savedDate = new Date(userInfo.birth);
      if (!isNaN(savedDate.getTime())) return savedDate;
    }
    return new Date();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <TouchableOpacity onPress={() => setIsInfoVisible(!isInfoVisible)}>
          <Ionicons
            name={isInfoVisible ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView style={styles.body}>
        <Item
          label="Ảnh của tôi"
          valueComponent={
            <Avatar avatarUri={avatarUri} pickImage={pickImage} />
          }
          isInfoVisible={isInfoVisible}
        />
        <TouchableOpacity
          onPress={() => handleOpenModal("name", userInfo.name)}
        >
          <Item
            label="Tên của bạn"
            inputValue={userInfo.name}
            isEditable
            isInfoVisible={isInfoVisible}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOpenModal("title", userInfo.title)}
        >
          <Item
            label="Danh xưng"
            inputValue={userInfo.title}
            isEditable
            isInfoVisible={isInfoVisible}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOpenModal("birth", userInfo.birth)}
        >
          <Item
            label="Ngày sinh"
            inputValue={userInfo.birth}
            isEditable
            isInfoVisible={isInfoVisible}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOpenModal("country", userInfo.country)}
        >
          <Item
            label="Quốc gia/Khu vực cư trú"
            inputValue={userInfo.country}
            isEditable
            isInfoVisible={isInfoVisible}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOpenModal("phoneEmail", userInfo.phoneEmail)}
        >
          <Item
            label="Số điện thoại/Email"
            inputValue={userInfo.phoneEmail}
            isEditable
            isInfoVisible={isInfoVisible}
            readOnly={userInfo.phoneEmail.includes("@")}
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal chỉnh sửa */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={[
                styles.modalContent,
                { height: currentField === "country" ? "70%" : "auto" },
              ]}
            >
              <Text style={styles.modalTitle}>
                Chỉnh sửa {getFieldLabel(currentField)}
              </Text>
              <View style={styles.modalBody}>
                {currentField === "country" ? (
                  <ScrollView>
                    {provinces.map((province, index) => (
                      <TouchableOpacity
                        key={`province-${province}-${index}`}
                        onPress={() => setTempValue(province)}
                        style={[
                          styles.provinceItem,
                          {
                            backgroundColor:
                              tempValue === province ? "#E6F3FA" : "white",
                          },
                        ]}
                      >
                        <Text>{province}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <TextInput
                    style={styles.modalInput}
                    placeholder={`Nhập ${getFieldLabel(currentField).toLowerCase()}`}
                    value={tempValue}
                    onChangeText={setTempValue}
                    autoFocus
                    keyboardType={
                      currentField === "phoneEmail" ? "phone-pad" : "default"
                    }
                  />
                )}
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={handleModalSave}
                >
                  <Text style={styles.modalSaveButtonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
        locale="vi_VN"
        confirmTextIOS="Xác nhận"
        cancelTextIOS="Hủy"
        maximumDate={new Date()}
        date={getInitialDateForPicker()}
      />
    </SafeAreaView>
  );
}

// ===== CÁC COMPONENT CON VÀ HÀM HỖ TRỢ =====
function Item({
  label,
  inputValue,
  valueComponent,
  isEditable,
  isInfoVisible,
  readOnly,
}) {
  const showEditText = isEditable && !readOnly;
  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemLabel}>{label}</Text>
          {showEditText && <Text style={styles.editText}>Chỉnh sửa</Text>}
        </View>
        {valueComponent || (
          <Text style={styles.inputField}>
            {isInfoVisible ? inputValue || "Chưa cập nhật" : "••••••••"}
          </Text>
        )}
      </View>
    </View>
  );
}
function Avatar({ avatarUri, pickImage }) {
  return (
    <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
      <Image source={{ uri: avatarUri }} style={styles.avatar} />
    </TouchableOpacity>
  );
}
const getFieldLabel = (field) => {
  switch (field) {
    case "name":
      return "Tên của bạn";
    case "title":
      return "Danh xưng";
    case "birth":
      return "Ngày sinh";
    case "country":
      return "Quốc gia/Khu vực";
    case "phoneEmail":
      return "Số điện thoại";
    default:
      return "";
  }
};

// ===== STYLESHEET =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#EAEBEE",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontWeight: "600",
    fontSize: 18,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  itemWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  itemContainer: {
    paddingVertical: 16,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 16,
    color: "#1D2A38",
    fontWeight: "500",
  },
  editText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "500",
  },
  inputField: {
    fontSize: 15,
    color: "#5A6A7A",
    minHeight: 20,
  },
  avatarWrapper: {
    marginTop: 8,
    alignSelf: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "column",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    flexShrink: 0,
  },
  modalBody: {
    flexShrink: 1,
    flexGrow: 1,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  provinceItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingBottom: 5,
    flexShrink: 0,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#F0F2F5",
    marginRight: 8,
  },
  modalCancelButtonText: {
    color: "#1D2A38",
    fontSize: 16,
    fontWeight: "600",
  },
  modalSaveButton: {
    backgroundColor: "#00639B",
    marginLeft: 8,
  },
  modalSaveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
