import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useState, useEffect } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function PriceStarFilterModal({
    visible,
    onClose,
    onApply,
    tours,
    initialPriceRange,
    initialMinRating,
}) {
    const [priceRange, setPriceRange] = useState(initialPriceRange || [0, 5000000]);
    const [selectedStars, setSelectedStars] = useState(initialMinRating || null); // Mặc định là null, giống FilterModal
    const [maxPrice, setMaxPrice] = useState(5000000); // Giá tối đa mặc định

    useEffect(() => {
        if (tours && tours.length > 0) {
            const maxTourPrice = Math.max(...tours.map((tour) => tour.price || 0));
            const roundedMaxPrice = Math.ceil(maxTourPrice / 100000) * 100000;
            setMaxPrice(roundedMaxPrice);
            if (priceRange[1] > roundedMaxPrice) {
                setPriceRange([priceRange[0], roundedMaxPrice]);
            }
        }
    }, [tours]);

    const filterTours = () => {
        if (!tours || tours.length === 0) {
            return [];
        }

        const filtered = tours.filter((tour) => {
            const priceInRange = tour.price >= priceRange[0] && tour.price <= priceRange[1];
            const tourRating = tour.rating ? Number(tour.rating) : 0;
            const starMatch = !selectedStars || Math.round(tourRating) === selectedStars;
            return priceInRange && starMatch;
        });
        return filtered;
    };

    const handleApply = () => {
        const filteredTours = filterTours();
        onApply({
            priceRange,
            minRating: selectedStars,
            filteredTours,
        });
        onClose();
    };

    const handleReset = () => {
        setPriceRange([0, 5000000]);
        setSelectedStars(null);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Lọc giá & sao</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                                pressedMarkerStyle={{ backgroundColor: "#007AFF" }}
                            />
                            <View style={styles.priceRow}>
                                <Text style={styles.priceText}>{priceRange[0].toLocaleString()}đ</Text>
                                <Text style={styles.priceText}>{priceRange[1].toLocaleString()}đ</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Số sao</Text>
                        <View style={styles.starList}>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    style={[styles.starItem, selectedStars === star && styles.starItemActive]}
                                    onPress={() => {
                                        setSelectedStars(star);
                                    }}
                                >
                                    <Ionicons
                                        name="star"
                                        size={16}
                                        color={selectedStars === star ? "#fff" : "#FF9500"}
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text style={[styles.starText, selectedStars === star && styles.starTextActive]}>
                                        {star}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                            <Text style={styles.resetText}>Đặt lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                            <Text style={styles.applyText}>Áp dụng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
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