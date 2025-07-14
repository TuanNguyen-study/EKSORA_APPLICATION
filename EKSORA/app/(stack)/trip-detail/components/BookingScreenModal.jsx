import { Dimensions, Modal, StyleSheet, View } from 'react-native';
import BookingScreen from '../../acount/bookingScreen';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const BookingScreenModal = ({
  visible,
  onClose,
  priceInfo,
  tourName,
  tourInfo,
  currentSelectedPackages,
  priceAdult,
  priceChild
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <BookingScreen
            isModal={true}
            onClose={onClose}
            priceInfo={priceInfo}
            tourName={tourName}
            tourInfo={tourInfo}
            currentSelectedPackages={currentSelectedPackages}
            selectedOptions={currentSelectedPackages}
            priceAdult={priceAdult}
            priceChild={priceChild}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    height: SCREEN_HEIGHT * 0.9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
});

export default BookingScreenModal;
