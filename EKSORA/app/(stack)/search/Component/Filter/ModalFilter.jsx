import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useState } from "react";
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { getToursByLocation } from "../../../../../API/services/serverCategories";
import LocationModal from "./LocationModal";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function FilterModal({ visible, onClose, onApply }) {
    const [priceRange, setPriceRange] = useState([500, 2000]);
    const [selectedStars, setSelectedStars] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationModalVisible, setLocationModalVisible] = useState(false);

const applyFilter = async () => {
    try {
        if (!selectedLocation?.id) {
            Alert.alert("Vui lòng chọn địa điểm trước khi áp dụng");
            return;
        }

        const cateID = selectedLocation.id;
        const tours = await getToursByLocation(cateID);

        // Điều hướng sang SearchResult với tour đã lọc
        router.push({
            pathname: "/(stack)/SearchResult",
            params: { filteredTours: JSON.stringify(tours) }
        });

        onClose();
    } catch (error) {
        console.error("Lỗi khi lọc tour:", error);
        Alert.alert("Lỗi", "Không thể lọc tour, vui lòng thử lại sau");
    }
};


    return (
        <>
            {/* Modal chính */}
            <Modal visible={visible} animationType="slide" transparent>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Bộ lọc</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            {/* Địa điểm */}
                            <Text style={styles.sectionTitle}>Địa điểm</Text>
                            <TouchableOpacity
                                style={styles.locationSelector}
                                onPress={() => setLocationModalVisible(true)}
                            >
                                <Text style={styles.locationSelectorText}>
                                    {selectedLocation?.name || "Chọn địa điểm"}
                                </Text>
                                <Ionicons name="chevron-forward" size={18} color="#888" />
                            </TouchableOpacity>

                            {/* Khoảng giá */}
                            <Text style={styles.sectionTitle}>Khoảng giá</Text>
                            <View style={styles.sliderContainer}>
                                <MultiSlider
                                    values={priceRange}
                                    min={0}
                                    max={5000000}
                                    step={100000}
                                    onValuesChange={setPriceRange}
                                    sliderLength={screenWidth - 60}
                                    selectedStyle={{ backgroundColor: "#007AFF" }}
                                    markerStyle={{
                                        backgroundColor: "#fff",
                                        borderWidth: 2,
                                        borderColor: "#007AFF",
                                        height: 20,
                                        width: 20,
                                    }}
                                    pressedMarkerStyle={{
                                        backgroundColor: "#007AFF",
                                    }}
                                />
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceText}>
                                        {priceRange[0].toLocaleString()}đ
                                    </Text>
                                    <Text style={styles.priceText}>
                                        {priceRange[1].toLocaleString()}đ
                                    </Text>
                                </View>
                            </View>

                            {/* Số sao */}
                            <Text style={styles.sectionTitle}>Số sao</Text>
                            <View style={styles.starList}>
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        style={[
                                            styles.starItem,
                                            selectedStars === star && styles.starItemActive,
                                        ]}
                                        onPress={() => setSelectedStars(star)}
                                    >
                                        <Ionicons
                                            name="star"
                                            size={16}
                                            color={selectedStars === star ? "#fff" : "#FF9500"}
                                            style={{ marginRight: 4 }}
                                        />
                                        <Text
                                            style={[
                                                styles.starText,
                                                selectedStars === star && styles.starTextActive,
                                            ]}
                                        >
                                            {star}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.resetBtn}
                                onPress={() => {
                                    setPriceRange([0, 5000000]);
                                    setSelectedStars(null);
                                    setSelectedLocation(null);
                                }}
                            >
                                <Text style={styles.resetText}>Đặt lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
                                <Text style={styles.applyText}>Áp dụng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal phụ */}
            <LocationModal
                visible={locationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
            />
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: "90%",
        overflow: "hidden",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },

    scrollContainer: {
        padding: 16,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#444",
        marginBottom: 8,
    },

    locationSelector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fafafa",
    },

    locationSelectorText: {
        fontSize: 14,
        color: "#333",
    },

    sliderContainer: {
        marginBottom: 20,
    },

    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },

    priceText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#555",
    },

    starList: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
    },

    starItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        backgroundColor: "#fff",
    },

    starItemActive: {
        backgroundColor: "#FF9500",
        borderColor: "#FF9500",
    },

    starText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },

    starTextActive: {
        color: "#fff",
    },

    footer: {
        flexDirection: "row",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        backgroundColor: "#f9f9f9",
    },

    resetBtn: {
        flex: 1,
        alignItems: "center",
        padding: 12,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: "#eaeaea",
    },

    resetText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
    },

    applyBtn: {
        flex: 1,
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#007AFF",
    },

    applyText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
    },
});
