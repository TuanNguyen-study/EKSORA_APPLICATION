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

  // Lấy 7 ngày đầu tiên từ availableDates (đã được sắp xếp theo thứ tự thời gian)
  const filteredDates = (availableDates || [])
    .filter((dateItem) => {
      // Xử lý cả trường hợp string và object
      const dateStr = typeof dateItem === 'string' ? dateItem : dateItem?.value;
      
      // Kiểm tra dateStr có hợp lệ không
      if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
        console.warn('Invalid date string:', dateItem);
        return false;
      }

      try {
        // Trim và kiểm tra xem có chứa dấu "/" không
        const trimmedDateStr = dateStr.trim();
        if (!trimmedDateStr.includes('/')) {
          console.warn('Date string does not contain "/":', trimmedDateStr);
          return false;
        }

        const parts = trimmedDateStr.split("/");
        
        // Kiểm tra có đủ ít nhất 2 phần (day/month) hoặc 3 phần (day/month/year)
        if (parts.length < 2 || parts.length > 3) {
          console.warn('Invalid date format - wrong number of parts:', trimmedDateStr);
          return false;
        }

        // Parse các phần và loại bỏ khoảng trắng
        const day = parseInt(parts[0].trim(), 10);
        const month = parseInt(parts[1].trim(), 10);
        const year = parts.length === 3 ? parseInt(parts[2].trim(), 10) : today.getFullYear();
        
        // Kiểm tra các giá trị có hợp lệ không
        if (isNaN(day) || isNaN(month) || day <= 0 || day > 31 || month <= 0 || month > 12) {
          console.warn('Invalid day/month values:', { day, month, year, original: trimmedDateStr });
          return false;
        }

        // Kiểm tra year nếu có
        if (parts.length === 3 && (isNaN(year) || year < 1900 || year > 2100)) {
          console.warn('Invalid year value:', { day, month, year, original: trimmedDateStr });
          return false;
        }

        // Tạo đối tượng Date
        const dateObj = new Date(year, month - 1, day);

        // Kiểm tra Date object có hợp lệ không
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid date object created from:', trimmedDateStr);
          return false;
        }

        // Kiểm tra xem ngày tạo ra có đúng với input không (để tránh trường hợp 31/2/2024)
        if (dateObj.getDate() !== day || dateObj.getMonth() !== month - 1 || dateObj.getFullYear() !== year) {
          console.warn('Date rollover detected:', { 
            input: trimmedDateStr, 
            created: `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}` 
          });
          return false;
        }

        // Chỉ lọc bỏ các ngày trong quá khứ
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        
        const dateStart = new Date(dateObj);
        dateStart.setHours(0, 0, 0, 0);

        return dateStart >= todayStart; // Chỉ lấy ngày hôm nay và tương lai
      } catch (error) {
        console.error('Error processing date:', dateStr, error);
        return false;
      }
    })
    .slice(0, 7); // Chỉ lấy 7 ngày đầu tiên

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dateSelectorScrollView}
    >

      {filteredDates.map((dateItem, index) => {
        try {
          // Xử lý cả trường hợp string và object
          const date = typeof dateItem === 'string' ? dateItem : dateItem.value || dateItem;
          
          if (!date || typeof date !== 'string') {
            console.warn('Invalid date item:', dateItem);
            return null;
          }

          // Xử lý an toàn khi split date để hiển thị
          const parts = date.split("/");
          const [day, month] = parts;
          
          return (
            <TouchableOpacity
              key={typeof dateItem === 'object' && dateItem.key ? dateItem.key : `date-${index}`}

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
        } catch (error) {
          console.error('Error rendering date:', dateItem, error);
          return null;
        }
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