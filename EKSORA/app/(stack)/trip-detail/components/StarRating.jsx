import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { COLORS } from "../../../../constants/colors";

const StarRating = ({ rating, size = 18, color = COLORS.warning }) => {
  const safeRating = Number.isFinite(rating) && rating >= 0 ? rating : 0;

  const fullStars = Math.floor(safeRating);
  const halfStar = safeRating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));

  return (
    <View style={{ flexDirection: "row" }}>
      {Array(fullStars).fill().map((_, i) => (
        <Ionicons key={`full_${i}`} name="star" size={size} color={color} />
      ))}
      {halfStar && (
        <Ionicons key="half" name="star-half-sharp" size={size} color={color} />
      )}
      {Array(emptyStars).fill().map((_, i) => (
        <Ionicons key={`empty_${i}`} name="star-outline" size={size} color={color} />
      ))}
    </View>
  );
};

export default StarRating;
