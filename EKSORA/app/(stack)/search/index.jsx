import { StyleSheet, View } from 'react-native';
import HeaderSearch from '../search/Component/headerSearch'
import BodySearch from '../search/Component/bodySearch';

const index = () => {
 return (
    <View style={styles.container}>
      <HeaderSearch />
        <BodySearch/>
    </View>
  );
};

export default index

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
  }
})