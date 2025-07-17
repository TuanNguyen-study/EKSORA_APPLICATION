import { COLORS } from '../../../../constants/colors';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import RenderHtml from 'react-native-render-html';

const { width } = Dimensions.get('window');

// Component để render từng mục trong danh sách 
const DescriptionCard = ({ item }) => {
  // mục văn bản
  if (item.type === 'text') {
    return (
      <View >
        <RenderHtml
          contentWidth={width - 32}
          source={{ html: `<p>${item.content}</p>` }}
          tagsStyles={{
            p: {
              fontSize: 14,
              color: COLORS.textSecondary,
              lineHeight: 22,
            },
            ul: {
              fontSize: 14,
              color: COLORS.textSecondary,
              marginLeft: 20,
            },
            li: {
              fontSize: 14,
              color: COLORS.textSecondary,
              marginBottom: 5,
            },
          }}
        />
      </View>
    );
  }

  if (item.type === 'image-text') {
    return (
      <View style={styles.imageItemContainer}>
        <Image source={{ uri: item.image }} style={styles.descriptionImage} />
        <Text style={styles.descriptionText}>{item.content}</Text>
      </View>
    );
  }

  return null;
};

// Component chính chứa toàn bộ danh sách
const DescriptionSection = ({ title, descriptionData }) => {
  if (!descriptionData || descriptionData.length === 0) {
    return null;
  }

  // Hàm render tiêu 
  const ListHeader = () => {
    if (!title) return null;
    return (
      <View style={styles.sectionHeaderContainer}>
        <View style={styles.decoratorLine} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={descriptionData}
        renderItem={({ item }) => <DescriptionCard item={item} />}
        keyExtractor={(item) => item.id} 
        ListHeaderComponent={ListHeader} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 20, 
        }}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white , 
  },

  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  decoratorLine: {
    width: 6,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text || '#1C1C1E',
  },

  imageItemContainer: {
    width: '100%',
    alignItems: 'center',
  },
  descriptionImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: COLORS.border,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});

export default DescriptionSection;