import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import styles from './styles';

const DateSelector = ({ availableDates, selectedDate, onSelectDate, onOpenCalendar }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelectorScrollView}>
      {availableDates.map((date, index) => {
        const [day, month] = date.split('/');
        return (
          <TouchableOpacity
            key={index}
            style={[styles.dateButton, selectedDate === date && styles.dateButtonSelected]}
            onPress={() => onSelectDate(date)}
          >
            <Text style={[styles.dateButtonText, selectedDate === date && styles.dateButtonTextSelected]}>
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