// TestMapScreen.jsx - Component đơn giản để test map
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const HO_CHI_MINH_CITY = {
  latitude: 10.7769,
  longitude: 106.7009,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function TestMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Map Screen</Text>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={HO_CHI_MINH_CITY}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={() => console.log('Test Map Ready!')}
          loadingEnabled={true}
        >
          <Marker
            coordinate={HO_CHI_MINH_CITY}
            title="Test Marker"
            description="This is a test marker in Ho Chi Minh City"
            pinColor="red"
          />
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  mapContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});