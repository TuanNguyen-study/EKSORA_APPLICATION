import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Alert, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '../../constants/colors';

const HO_CHI_MINH_DEFAULT = {
  latitude: 10.7769,
  longitude: 106.7009,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function CurrentLocationMap({
  onLocationFound,
  onLocationError,
  tourData,
  onMarkerPress,
}) {
  const mapRef = useRef(null);
  const [tourMarkers, setTourMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState(HO_CHI_MINH_DEFAULT);
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const locationCallbackCalled = useRef(false);

  // Debug function
  const debugLog = (message, data) => {
    console.log(`[CurrentLocationMap] ${message}:`, data);
  };

  // Lấy location ngay khi component mount
  useEffect(() => {
    let mounted = true;
    
    const getLocation = async () => {
      debugLog('Starting location request');
      setIsLoading(true);
      
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        debugLog('Permission status', status);
        
        if (status !== 'granted') {
          throw new Error('Location permission denied');
        }

        // Check if location service is enabled
        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) {
          throw new Error('Location service is disabled');
        }

        debugLog('Getting current position...');
        const locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 10000,
        });
        
        if (!mounted) return;
        
        debugLog('Location received', {
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
        });

        const coords = locationResult.coords;
        setCurrentLocation(coords);
        
        const newRegion = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        
        setRegion(newRegion);
        debugLog('Region updated', newRegion);

        // Notify parent component
        if (onLocationFound && !locationCallbackCalled.current) {
          onLocationFound(locationResult);
          locationCallbackCalled.current = true;
          debugLog('Location callback called');
        }

      } catch (error) {
        if (!mounted) return;
        
        debugLog('Location error, using fallback', error.message);
        
        // Use Ho Chi Minh City as fallback
        const fallbackCoords = {
          latitude: HO_CHI_MINH_DEFAULT.latitude,
          longitude: HO_CHI_MINH_DEFAULT.longitude,
        };
        
        setCurrentLocation(fallbackCoords);
        setRegion(HO_CHI_MINH_DEFAULT);
        
        // Still call parent callback with fallback
        if (onLocationFound && !locationCallbackCalled.current) {
          onLocationFound({ coords: fallbackCoords });
          locationCallbackCalled.current = true;
          debugLog('Fallback location callback called');
        }
        
        if (onLocationError) {
          onLocationError(`Using default location: ${error.message}`);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getLocation();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Process tour markers
  useEffect(() => {
    if (!tourData || tourData.length === 0) {
      setTourMarkers([]);
      return;
    }
    
    let mounted = true;
    
    const processMarkers = async () => {
      debugLog('Processing tour markers', { tourDataLength: tourData.length });
      
      const markers = [];
      
      for (const tour of tourData) {
        try {
          if (!tour.location || !tour.cateID?.name) continue;
          
          const mainLocation = tour.location.split(',')[0].trim();
          const fullLocationString = `${mainLocation}, ${tour.cateID.name}`;
          
          debugLog('Geocoding location', fullLocationString);
          
          const geocodedLocations = await Location.geocodeAsync(fullLocationString);
          
          if (geocodedLocations?.length > 0) {
            const { latitude, longitude } = geocodedLocations[0];
            
            markers.push({
              key: tour._id,
              _id: tour._id,
              latitude,
              longitude,
              title: tour.name,
              imageUrl: Array.isArray(tour.image) ? tour.image[0] : tour.image,
            });
            
            debugLog('Marker added', { 
              title: tour.name, 
              lat: latitude, 
              lng: longitude 
            });
          }
        } catch (e) {
          debugLog('Geocoding error', { location: tour.location, error: e.message });
        }
      }
      
      if (mounted) {
        setTourMarkers(markers);
        debugLog('Markers processing complete', { 
          total: tourData.length, 
          success: markers.length 
        });
      }
    };
    
    processMarkers();
    
    return () => {
      mounted = false;
    };
  }, [tourData]);

  // Handle map ready and fit coordinates
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    
    debugLog('Map ready, fitting coordinates');
    
    const allCoordinates = [];
    
    // Add current location
    if (currentLocation) {
      allCoordinates.push({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    }
    
    // Add tour markers
    tourMarkers.forEach(marker => {
      allCoordinates.push({
        latitude: marker.latitude,
        longitude: marker.longitude,
      });
    });
    
    if (allCoordinates.length > 0) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(allCoordinates, {
          edgePadding: { top: 150, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
        debugLog('Map fitted to coordinates', allCoordinates.length);
      }, 1000);
    }
  }, [mapReady, currentLocation, tourMarkers]);

  const handleMapReady = () => {
    debugLog('Map is ready');
    setMapReady(true);
  };

  if (isLoading) {
    return (
      <View style={[styles.mapContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onMapReady={handleMapReady}
        showsUserLocation={false} // Tắt để dùng custom marker
        showsMyLocationButton={true}
        showsCompass={false}
        loadingEnabled={true}
        loadingIndicatorColor={COLORS.primary}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {/* Current location marker */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Vị trí của bạn"
            pinColor="blue"
            identifier="current-location"
          />
        )}

        {/* Tour markers */}
        {tourMarkers.map(marker => (
          <Marker
            key={marker.key}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            onPress={() => {
              debugLog('Marker pressed', marker._id);
              onMarkerPress && onMarkerPress(String(marker._id));
            }}
            identifier={`tour-${marker._id}`}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerImageContainer}>
                <Image
                  source={{ 
                    uri: marker.imageUrl || 'https://via.placeholder.com/60x60/cccccc/666666?text=Tour'
                  }}
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
    minHeight: 300,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary || '#666',
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
    borderColor: COLORS.primary || '#007AFF',
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
    borderTopColor: COLORS.primary || '#007AFF',
    marginTop: -3, 
  }
});