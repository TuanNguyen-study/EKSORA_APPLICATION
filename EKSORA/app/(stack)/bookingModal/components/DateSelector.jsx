import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../../../constants/colors";
import styles from "./styles";

const DateSelector = ({
  availableDates,
  selectedDate,
  onSelectDate,
  onOpenCalendar,
}) => {
  // Lấy ngày hiện tại
  const today = new Date();

  // Lọc ra chỉ các ngày trong 7 ngày tới
  const filteredDates = availableDates.filter((dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    const dateObj = new Date(year || today.getFullYear(), month - 1, day);

    const diffTime = dateObj - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= 7;
  });
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dateSelectorScrollView}
    >
      {filteredDates.map((date, index) => {
        const [day, month] = date.split("/");
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateButton,
              selectedDate === date && styles.dateButtonSelected,
            ]}
            onPress={() => onSelectDate(date)}
          >
            <Text
              style={[
                styles.dateButtonText,
                selectedDate === date && styles.dateButtonTextSelected,
              ]}
            >
              {`${day}/${month}`}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.dateButton, styles.dateButtonDisabled]}
        onPress={onOpenCalendar}
      >
        <Ionicons name="calendar-outline" size={20} color={COLORS.black} />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DateSelector;
