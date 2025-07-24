import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

// Import các component liên quan đến bản đồ từ thư viện react-native-maps
// MapView: Cái khung chính để hiển thị bản đồ.
// Marker: Cái ghim để đánh dấu một điểm trên bản đồ.
// UrlTile: Lớp "gạch" bản đồ được lấy từ một URL, dùng để hiển thị OpenStreetMap.
import MapView, { Marker, UrlTile } from 'react-native-maps';

// Import thư viện expo-location để truy cập GPS và lấy tọa độ của người dùng.
import * as Location from 'expo-location';

// Import hằng số màu sắc đã định nghĩa sẵn để giao diện nhất quán.
import { COLORS } from '../../constants/colors';

// --- PHẦN 2: ĐỊNH NGHĨA COMPONENT CHÍNH ---

// Component CurrentLocationMap là một Function Component.
// Nó nhận vào một prop tên là `onLocationFound`.
// `onLocationFound` là một hàm callback, có nhiệm vụ "báo cáo" vị trí tìm được về cho component cha (HomeScreen).
export default function CurrentLocationMap({ onLocationFound }) {

  // --- PHẦN 3: KHAI BÁO STATE VÀ REF ---
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const locationCallbackCalled = useRef(false);

  // --- PHẦN 4: LOGIC LẤY VỊ TRÍ VỚI useEffect ---
  useEffect(() => {
    (async () => {
      // 1. Xin quyền truy cập vị trí từ người dùng.
      // `requestForegroundPermissionsAsync` sẽ hiện một hộp thoại hỏi người dùng.
      let { status } = await Location.requestForegroundPermissionsAsync();
    
      if (status !== 'granted') {
        setErrorMsg('Quyền truy cập vị trí đã bị từ chối! Vui lòng cấp quyền trong cài đặt.');
        setLoading(false); 
        return; 
      }

      // 2. Nếu đã được cấp quyền, bắt đầu lấy vị trí.
      try {
        // `getCurrentPositionAsync` sẽ lấy tọa độ hiện tại của thiết bị.
        const currentLocation = await Location.getCurrentPositionAsync({});
        // Cập nhật state `location` với thông tin vừa lấy được.
        setLocation(currentLocation);

        // 3. Báo cáo vị trí về cho component cha.
        // Kiểm tra các điều kiện:
        // - `currentLocation` có tồn tại (lấy vị trí thành công).
        // - `onLocationFound` có được truyền vào (component cha muốn nhận kết quả).
        // - `!locationCallbackCalled.current` (hàm này chưa được gọi lần nào).
        if (currentLocation && onLocationFound && !locationCallbackCalled.current) {
          // Gọi hàm callback với dữ liệu vị trí.
          onLocationFound(currentLocation);
          // Đặt "cờ" thành true để không gọi lại nữa.
          locationCallbackCalled.current = true;
        }
      } catch (error) {
        setErrorMsg('Không thể lấy được vị trí hiện tại.');
      } finally {
        setLoading(false);
      }
    })();
  }, [onLocationFound]);

  // --- PHẦN 5: RENDER GIAO DIỆN DỰA TRÊN STATE ---

  // React sẽ render một trong các khối dưới đây tùy thuộc vào giá trị của các state.

  // Trường hợp 1: Đang loading
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.infoText}>Đang tìm vị trí của bạn...</Text>
      </View>
    );
  }

  // Trường hợp 2: Có lỗi xảy ra
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  // Trường hợp 3: Lấy vị trí thành công (`location` có dữ liệu)
  if (location) {
    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          // `initialRegion` thiết lập vùng bản đồ hiển thị ban đầu,
          // tập trung vào vị trí của người dùng.
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02, // Mức độ zoom theo chiều dọc
            longitudeDelta: 0.02, // Mức độ zoom theo chiều ngang
          }}
        >
          {/* Hiển thị lớp bản đồ từ OpenStreetMap */}
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19} // Mức zoom tối đa cho phép
            flipY={false} // Cài đặt tiêu chuẩn cho OSM
          />
          {/* Đặt một cái ghim tại vị trí của người dùng */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Vị trí của bạn"
          />
        </MapView>
      </View>
    );
  }

  // Trường hợp 4: Trường hợp dự phòng (hiếm khi xảy ra)
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Không thể hiển thị bản đồ.</Text>
    </View>
  );
}


// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoText: {
    fontSize: 16, 
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});