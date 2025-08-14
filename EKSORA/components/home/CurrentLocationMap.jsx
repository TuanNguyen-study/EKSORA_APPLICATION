import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; 
import * as Location from 'expo-location';
import { COLORS } from '../../constants/colors';

const VIETNAM_REGION = {
  latitude: 16.047079,
  longitude: 108.206230,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

//  Cập nhật danh sách props
export default function CurrentLocationMap({
  onLocationFound,
  onLocationError,
  tourData,
  onMarkerPress,
  customMapStyle,
}) {
  const mapRef = useRef(null);
  const [tourMarkers, setTourMarkers] = useState([]);
  const locationCallbackCalled = useRef(false);

  // --- LOGIC LẤY VỊ TRÍ ---
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (onLocationError) {
          onLocationError('Quyền truy cập vị trí đã bị từ chối!');
        }
        return;
      }

      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        if (onLocationFound && !locationCallbackCalled.current) {
          onLocationFound(currentLocation);
          locationCallbackCalled.current = true;
        }
      } catch (error) {
        if (onLocationError) {
          onLocationError('Không thể lấy được vị trí hiện tại.');
        }
      }
    };
    getLocation();
  }, [onLocationFound, onLocationError]); // Thêm onLocationError vào dependencies

  // --- LOGIC XỬ LÝ MARKER ---
  useEffect(() => {
    const processAndDisplayMarkers = async () => {
      if (!tourData || tourData.length === 0) {
        setTourMarkers([]);
        return;
      }
      
      const markers = [];
      for (const tour of tourData) {
        const mainLocation = tour.location.split(',')[0].trim();
        if (mainLocation && tour.cateID?.name) {
          try {
            const fullLocationString = `${mainLocation}, ${tour.cateID.name}`;
            const geocodedLocations = await Location.geocodeAsync(fullLocationString);
            
            if (geocodedLocations?.length > 0) {
              const { latitude, longitude } = geocodedLocations[0];
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
            console.warn(`Không thể geocode địa điểm: ${mainLocation}`, e);
          }
        }
      }
      
      setTourMarkers(markers);
      
      if (mapRef.current && markers.length > 0) {
        const markerCoordinates = markers.map(m => ({
          latitude: m.latitude,
          longitude: m.longitude,
        }));
        
        mapRef.current.fitToCoordinates(markerCoordinates, {
          edgePadding: { top: 150, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    };
    
    processAndDisplayMarkers();
  }, [tourData]);

  
  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        //  Dùng provider của Google
        provider={PROVIDER_GOOGLE}
        //  Áp dụng style tùy chỉnh
        customMapStyle={customMapStyle}
        initialRegion={VIETNAM_REGION}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >

        
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


const styles = StyleSheet.create({
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
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
        borderColor: COLORS.primary,
        borderWidth: 2,
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
        borderTopColor: COLORS.primary,
        marginTop: -3, 
    }
});