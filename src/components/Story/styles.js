import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    zIndex: 1,
    ...StyleSheet.absoluteFill,
    width: null,
    height: null,
  },

  header: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    width: width,
    height: 20,
    padding: 16,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

export default styles;
