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
  Easing,
} from 'react-native';
import {useInterval} from '../../hooks/useInterval';
import {useDispatch, useSelector} from 'react-redux';

import {
  nextImage,
  reset,
  updateCurrentStoryIndex,
} from '../../redux/slices/stories.slice';

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
});

const Story = ({story, index}) => {
  const {photos} = story;

  const animation = useRef(new Animated.Value(0));

  useEffect(() => {
    const res = Animated.loop(
      Animated.timing(animation.current, {
        toValue: 100,
        duration: 5000,
        useNativeDriver: false,
      }),
    );

    res.start();
  }, []);

  const width2 = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={{width: '100%', uri: photos[index]?.source}}
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
                  {backgroundColor: 'white', width: width2},
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Story;
