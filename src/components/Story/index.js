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

const Story = ({story, selfIndex, scrollRef, canChange}) => {
  const {photos} = story;
  const index = useSelector(state => state.stories.images[selfIndex].index);
  const totalStories = useSelector(state => state.stories.images.length);
  const currentStoryIndex = useSelector(
    state => state.stories.currentStoryIndex,
  );
  const animation = useRef(new Animated.Value(0));

  const dispatch = useDispatch();

  // useEffect(() => {
  //   Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(animation.current, {
  //         toValue: 100,
  //         duration: 4000,
  //         useNativeDriver: false,
  //       }),
  //       Animated.timing(animation.current, {
  //         toValue: 0,
  //         duration: 0,
  //         useNativeDriver: false,
  //       }),
  //     ]),
  //   ).start();
  // }, []);

  // const width2 = animation.current.interpolate({
  //   inputRange: [0, 100],
  //   outputRange: ['0%', '100%'],
  //   extrapolate: 'clamp',
  // });

  // useInterval(() => {
  //   if (selfIndex === currentStoryIndex) {
  //     console.log('selfIndex', selfIndex);
  //     console.log('currentStoryIndex', currentStoryIndex);
  //     dispatch(nextImage({storyIndex: selfIndex}));
  //     console.log('index', index);
  //     if (index === photos.length - 1) {
  //       console.log('aq', index);
  //       if (selfIndex < totalStories - 1)
  //         dispatch(updateCurrentStoryIndex({index: selfIndex + 1}));

  //       scrollRef?.current?.scrollTo({x: (selfIndex + 1) * width});

  //       if (selfIndex === totalStories - 1) {
  //         scrollRef?.current?.scrollTo({x: 0});
  //         dispatch(reset());
  //       }
  //     }
  //   }
  // }, 4000);

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
    </SafeAreaView>
  );
};

export default Story;
