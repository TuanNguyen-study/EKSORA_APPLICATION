import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '../../constants/colors';

// ---  Tọa độ trung tâm và mức zoom cho bản đồ Việt Nam ---
const VIETNAM_REGION = {
  latitude: 16.047079,   // Vĩ độ trung tâm (Đà Nẵng)
  longitude: 108.206230, // Kinh độ trung tâm (Đà Nẵng)
  latitudeDelta: 12,    // Mức độ zoom theo chiều dọc để thấy cả nước
  longitudeDelta: 12,   // Mức độ zoom theo chiều ngang
};

export default function CurrentLocationMap({ onLocationFound, tourData, onMarkerPress }) {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const locationCallbackCalled = useRef(false);
  const mapRef = useRef(null);
  const [tourMarkers, setTourMarkers] = useState([]);

  // --- LOGIC LẤY VỊ TRÍ  ---
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Quyền truy cập vị trí đã bị từ chối!');
        setLoading(false);
        return;
      }
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        if (onLocationFound && !locationCallbackCalled.current) {
          onLocationFound(currentLocation);
          locationCallbackCalled.current = true;
        }
      } catch (error) {
        setErrorMsg('Không thể lấy được vị trí hiện tại.');
      } finally {
        setLoading(false);
      }
    };
    getLocation();
  }, [onLocationFound]);


  // ---  Cập nhật logic xử lý để lấy cả HÌNH ẢNH của tour ---
  useEffect(() => {
    const processAndDisplayMarkers = async () => {
      if (!tourData || tourData.length === 0) {
        setTourMarkers([]);
        // Nếu không có tour nào, zoom về VN
        if(mapRef.current) {
            mapRef.current.animateToRegion(VIETNAM_REGION, 1000);
        }
        return;
      }

      const markers = [];
      for (const tour of tourData) {
           // 1. Lấy tên địa điểm từ dữ liệu tour
        const mainLocation = tour.location.split(',')[0].trim();
        if (mainLocation && tour.cateID && tour.cateID.name) { // Kiểm tra xem cateID có tồn tại không
        try {
            // Tạo chuỗi truy vấn đầy đủ và rõ ràng hơn
            const fullLocationString = `${mainLocation}, ${tour.cateID.name}`;

            // 2. HÀM QUAN TRỌNG NHẤT: Chuyển tên địa điểm thành tọa độ
            const geocodedLocations = await Location.geocodeAsync(fullLocationString); 
            
            if (geocodedLocations && geocodedLocations.length > 0) {
              // 3. Lấy tọa độ (latitude, longitude) từ kết quả
              const { latitude, longitude } = geocodedLocations[0];
              // 4. Tạo một đối tượng marker hoàn chỉnh
              markers.push({
                key: tour._id, 
                _id: tour._id,
                latitude,
                longitude,
                title: tour.name,
                imageUrl: tour.image,  
              });
            }
          } catch (e) {
            console.log(`Không thể geocode địa điểm: ${mainLocation}`, e);
          }
        }
      }
      
      setTourMarkers(markers);
      
      if (mapRef.current && markers.length > 0) {
         // Zoom để hiển thị tất cả các marker
         setTimeout(() => {
            // Lấy ra tọa độ của tất cả các marker để fit
            const markerCoordinates = markers.map(m => ({
              latitude: m.latitude,
              longitude: m.longitude,
            }));
            mapRef.current.fitToCoordinates(markerCoordinates, {
              edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
         }, 4000);
      }
    };
    
    processAndDisplayMarkers();
  }, [tourData]);


  // Giao diện Render
  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.infoText}>Đang tải bản đồ...</Text></View>;
  }
  if (errorMsg) {
    return <View style={styles.container}><Text style={styles.errorText}>{errorMsg}</Text></View>;
  }
  
  return (
    <View style={styles.mapContainer}>
      <MapView
        key={tourMarkers.length}
        ref={mapRef}
        style={styles.map}
        //  Thiết lập vùng hiển thị ban đầu là Việt Nam
        initialRegion={VIETNAM_REGION}
        showsUserLocation={true}
      >
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        
        {/* Render Marker với hình ảnh tùy chỉnh  */}
        {tourMarkers.map(marker => (
          <Marker
            key={marker.key}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            onPress={() => onMarkerPress && onMarkerPress(String(marker._id))}
          >
            {/* Đây là phần giao diện tùy chỉnh cho Marker */}
            <View style={styles.customMarker}>
              <View style={styles.markerImageContainer}>
                 <Image
                    source={{ uri: marker.imageUrl }}
                    style={styles.markerImage}
                    resizeMode="cover"
                 />
              </View>
              <View style={styles.calloutArrow} />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

// ---  Thêm style cho Marker tùy chỉnh ---
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
    mapContainer: { ...StyleSheet.absoluteFillObject },
    map: { ...StyleSheet.absoluteFillObject },
    infoText: { fontSize: 16, color: COLORS.textSecondary, marginTop: 10 },
    errorText: { fontSize: 16, color: 'red', textAlign: 'center', paddingHorizontal: 20 },
    
    // Style cho Marker tùy chỉnh
    customMarker: {
        alignItems: 'center',
    },
    markerImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30, 
        backgroundColor: '#fff',
        padding: 4, 
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    markerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 26, 
    },
    calloutArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#fff', 
        marginTop: -1, 
    }
});