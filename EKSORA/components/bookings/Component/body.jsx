  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useEffect, useState } from 'react';
  import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
  import { getTrips } from '../../../API/services/servicesBooking';
  import { router } from 'expo-router';

  export default function Body() {
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState([]);

    useEffect(() => {
      const fetchTrips = async () => {
        try {
          const userId = await AsyncStorage.getItem('USER_ID');
          console.log('userId từ AsyncStorage:', userId);
          if (userId) {
            const data = await getTrips(userId);
            setTrips(data);
          } else {
            console.warn('Không tìm thấy userId');
          }
        } catch (error) {
          console.error('Lỗi khi tải chuyến đi:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTrips();
    }, []);

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={trips}
          renderItem={({ item }) => (
            <View style={styles.tripItem}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item?.tour_id?.image?.[0] }}
                  style={styles.image}
                />
                <Text
                  style={styles.link}
                  onPress={() => router.push({
                    pathname: '/(stack)/ScheduleDetail',
                    params: {
                      tourName: item?.tour_id?.name,
                      nguoiLon: item?.quantity_nguoiLon?.toString() || '1',
                      treEm: item?.quantity_treEm?.toString() || '0',
                      tourImages: JSON.stringify(item?.tour_id?.image || []),
                      totalPrice: item?.totalPrice?.toString() || '0',
                      cateID: item?.tour_id?.cateID,
                      time:item?.tour_id?.opening_time,
                      close:item?.tour_id?.closing_time,
                    }
                  })}
                >
                  Lịch trình đề xuất
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item?.tour_id?.name}</Text>
                <Text style={styles.location}>{item?.tour_id?.location}</Text>
                <Text style={styles.info}>
                  Ngày đi: {new Date(item.travel_date).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          contentContainerStyle={[
            trips.length === 0 ? styles.noResultsContainer : styles.listContainer,
          ]}
          ListEmptyComponent={
            <View style={styles.noResultsContent}>
              <Image
                source={require('../../../assets/images/tripsImage.png')}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.noResults}>Chưa có chuyến đi sắp tới...!</Text>
            </View>
          }
          ListFooterComponent={<View style={styles.footerSpacing} />}
        />
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: Platform.OS === 'android' ? 24 : 0,
    },
    listContainer: {
      padding: 16,
    },
    footerSpacing: {
      height: 140,
    },
    tripItem: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 20,
      marginVertical: 10,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    imageContainer: {
      alignItems: 'center',
      width: 130,
      paddingVertical: 10,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 20,
      resizeMode: 'cover',
    },
    link: {
      marginTop: 8,
      fontSize: 13,
      color: '#2196F3',
      fontStyle: 'italic',
      opacity: 0.95,
      fontWeight: '500',
    },
    textContainer: {
      flex: 1,
      padding: 14,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 17,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
    },
    location: {
      fontSize: 14,
      color: '#777',
      marginBottom: 6,
    },
    info: {
      fontSize: 13,
      color: '#555',
      marginBottom: 4,
    },
    status: {
      fontSize: 13,
      color: '#fff',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 8,
      textTransform: 'capitalize',
      overflow: 'hidden',
    },
    statusPending: {
      backgroundColor: '#FFA500',
    },
    statusCanceled: {
      backgroundColor: '#B00020',
    },
    statusConfirmed: {
      backgroundColor: '#4CAF50',
    },
    noResultsContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    noResultsContent: {
      alignItems: 'center',
      marginTop: 32,
    },
    emptyImage: {
      width: 200,
      height: 150,
      marginBottom: 16,
    },
    noResults: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: "#999",
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
  });
