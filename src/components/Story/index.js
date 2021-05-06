import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {useInterval} from '../../hooks/useInterval';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: null,
    height: null,
  },

  header: {
    // ...StyleSheet.absoluteFillObject,
    // bottom: 0,
    position: 'absolute',
    top: 0,
    width: width,
    // backgroundColor: 'red',
    height: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',

    padding: 16,
  },

  footer: {
    // ...StyleSheet.absoluteFillObject,
    // bottom: 0,
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 218,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,

    padding: 16,
  },

  input: {
    borderWidth: 2,
    borderColor: 'white',
    height: 28,
    width: 250,
    borderRadius: Platform.OS === 'android' ? 0 : 10,
  },
});

const Story = ({story, indexPhoto, canChange, currentIndexStory, nextFn}) => {
  const {source, photos} = story;
  const [index, setIndex] = useState(indexPhoto);
  let animation = useRef(new Animated.Value(0));

  /* useInterval(() => {
    // console.log('currentIndexStory', currentIndexStory);
    if (canChange) {
      nextFn(currentIndexStory, indexPhoto);
    }
  }, 4000); */

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation.current, {
          toValue: 100,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(animation.current, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [index]);

  const width = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    if (canChange) {
      setIndex(indexPhoto);
    }
  }, [indexPhoto, canChange]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={{width: '100%', uri: photos[index].source}}
      />

      <View style={styles.header}>
        {photos.map((_, i) => (
          <View
            key={i}
            style={{
              height: 2,
              backgroundColor: i < index ? 'white' : '#ababab',
              flex: 1,
              marginHorizontal: 2,
              borderRadius: 50,
            }}>
            {i === index && (
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  {backgroundColor: 'white', width: '100%'},
                ]}></Animated.View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.footer}></View>
    </SafeAreaView>
  );
};

export default Story;
