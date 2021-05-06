import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import ButtonStory from '../ButtonStory';
import Story from '../Story';

const {width} = Dimensions.get('window');
const perspective = width;
const angle = Math.atan(perspective / (width / 2));
const ratio = Platform.OS === 'ios' ? 2 : 1.2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

const Stories = ({stories = []}) => {
  const [x, setX] = useState(new Animated.Value(0));
  const scroll = useRef(null);
  const [indexPhoto, setIndexPhoto] = useState(0);
  const [currentIndexStory, setCurrentIndexStory] = useState(0);

  const getStyle = index => {
    const offset = width * index;
    const inputRange = [offset - width, offset + width];

    const translateX = x.interpolate({
      inputRange,
      outputRange: [width / ratio, -width / ratio],
      extrapolate: 'clamp',
    });
    const rotateY = x.interpolate({
      inputRange,
      outputRange: [`${angle}rad`, `-${angle}rad`],
      extrapolate: 'clamp',
    });

    const translateX1 = x.interpolate({
      inputRange,
      outputRange: [width / 2, -width / 2],
      extrapolate: 'clamp',
    });

    const extra = width / ratio / Math.cos(angle / 2) - width / ratio;
    const translateX2 = x.interpolate({
      inputRange,
      outputRange: [-extra, extra],
      extrapolate: 'clamp',
    });

    return {
      ...StyleSheet.absoluteFillObject,
      transform: [
        {perspective},
        {translateX},
        {rotateY},
        {translateX: translateX1},
        {translateX: translateX2},
      ],
    };
  };

  function prevFn(currentIndexStory, currentIndexPhoto) {
    if (currentIndexPhoto === 0) {
      return scroll?.current?.scrollTo({x: (currentIndexStory - 1) * width});
    }

    setIndexPhoto(currentIndexPhoto - 1);
  }

  function nextFn(currentIndexStory, currentIndexPhoto) {
    setCurrentIndexStory(currentIndexStory);
    const lastPhoto = stories[currentIndexStory].photos.length - 1;

    if (currentIndexPhoto === lastPhoto) {
      // setCurrentIndexStory(currentIndexStory + 1);
      return scroll?.current?.scrollTo({x: (currentIndexStory + 1) * width});
    }

    setIndexPhoto(currentIndexPhoto + 1);
  }

  return (
    <View style={styles.container}>
      {stories.map((story, index) => (
        <Animated.View style={[getStyle(index)]} key={story.id}>
          <Story
            {...{story}}
            indexPhoto={indexPhoto}
            canChange={index === currentIndexStory}
            currentIndexStory={index}
            nextFn={nextFn}
          />
        </Animated.View>
      ))}
      <Animated.ScrollView
        ref={scroll}
        style={StyleSheet.absoluteFillObject}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={0}
        contentContainerStyle={{width: width * stories.length}}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {x}}}], {
          listener: e => {
            const currentPosScrol = parseInt(e.nativeEvent.contentOffset.x);
            if (currentPosScrol % parseInt(width) === 0) {
              setIndexPhoto(0);
            }
          },
          useNativeDriver: true,
        })}
        decelerationRate={'fast'}
        horizontal>
        <View
          style={{
            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
            flex: 1,
            flexDirection: 'row',
          }}>
          {stories.map((_, index) => (
            <ButtonStory
              key={index}
              prevFn={() => prevFn(index, indexPhoto)}
              nextFn={() => nextFn(index, indexPhoto)}
            />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default Stories;

/* 
<>
              <Pressable
                onTouchEnd={() => {
                  console.log('eeeeeend');
                  scroll.current.scrollTo({
                    x: (index - 1) * width,
                  });
                }}
                style={{
                  // backgroundColor: 'rgba(110, 50, 38, 0.5)',
                  width: width * 0.3,
                }}>
                <Text>hau</Text>
              </Pressable>
              <Pressable
                onTouchEnd={() => {
                  console.log('eeeeeend 2');
                  scroll.current.scrollTo({
                    x: (index + 1) * width,
                  });
                }}
                style={{
                  // backgroundColor: 'rgba(38, 50, 110, 0.5)',
                  width: width * 0.7,
                }}>
                <Text>hau</Text>
              </Pressable>
            </>
*/
