import React, {useEffect, useRef} from 'react';
import {Animated, Image, SafeAreaView, StyleSheet, View} from 'react-native';

import styles from './styles';

const Story = ({story, index, pause, children, style}) => {
  const {photos} = story;

  const animation = useRef(new Animated.Value(0));
  const res = Animated.loop(
    Animated.timing(animation.current, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }),
  );

  useEffect(() => {
    if (pause) {
      res.reset();
    } else {
      res.start();
    }
  }, [pause]);

  const width2 = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={[styles.container, style]}>
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

      <Image
        style={styles.image}
        source={{width: '100%', uri: photos[index]?.source}}
      />

      {children}
    </SafeAreaView>
  );
};

export default Story;
