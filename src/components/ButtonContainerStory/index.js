import React from 'react';
import {Dimensions, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
const {width} = Dimensions.get('window');

import ButtonStory from '../ButtonStory';

import {
  changeActiveStory,
  next,
  nextImage,
  prev,
  prevImage,
  updateCurrentStoryIndex,
  resetStories,
} from '../../redux/slices/stories.slice';

import styles from './styles';

const ButtonContainerStory = ({
  stories,
  scrollRef,
  isLastImage,
  isFirstImage,
  currentStoryIndex,
  isLastStory,
  isFirstStory,
}) => {
  const dispatch = useDispatch();
  // const images = useSelector(state => state.stories.images);

  /* console.log('stories ====> ', stories);
  console.log('isLastImage ====> ', isLastImage);
  console.log('isFirstImage ====> ', isFirstImage);
  console.log('currentStoryIndex ====> ', currentStoryIndex); */

  console.log('isLastStory', isLastStory);

  return (
    <View style={styles.container}>
      {stories.map((_, index) => (
        <ButtonStory
          key={index}
          prevFn={async () => {
            console.log('prevFN');
            if (isFirstImage) {
              console.log('first image');
              if (isFirstStory) {
                /*                 console.log('first story');
                await dispatch(prev({storyindex: index}));
                await dispatch(resetStories());
                scrollRef?.current?.scrollTo({x: (stories.length - 1) * width}); */
              } else {
                dispatch(prev({storyindex: index}));
                scrollRef?.current?.scrollTo({x: (index - 1) * width});
              }
            } else {
              // console.log('dispatch');
              dispatch(prev({storyindex: index}));
            }
            // if (isFirstImage) {
            //   dispatch(
            //     changeActiveStory({
            //       index: currentStoryIndex - 1,
            //       isActive: true,
            //     }),
            //   );
            //   dispatch(
            //     changeActiveStory({
            //       index: currentStoryIndex,
            //       isActive: false,
            //     }),
            //   );
            //   scrollRef?.current?.scrollTo({x: (index - 1) * width});
            // } else {
            //   dispatch(prev({storyindex: index}));
            // }
            // // dispatch(prev());
          }}
          nextFn={async () => {
            console.log('nextFN');
            if (isLastImage) {
              console.log('last image');
              if (isLastStory) {
                console.log('last story');
                await dispatch(next({storyindex: index}));
                await dispatch(resetStories());
                scrollRef?.current?.scrollTo({x: 0});
              } else {
                dispatch(next({storyindex: index}));
                scrollRef?.current?.scrollTo({x: (index + 1) * width});
              }
            } else {
              console.log('dispatch');
              dispatch(next({storyindex: index}));
            }
            // console.log('Chamou nextfn =>');
            // if (isLastImage) {
            //   console.log('isLastImage ===>');
            //   if (isLastStory) {
            //     console.log('isLastStory ======>');
            //     await dispatch(
            //       changeActiveStory({
            //         index: 0,
            //         isActive: true,
            //       }),
            //     );
            //     await dispatch(
            //       changeActiveStory({
            //         index: currentStoryIndex,
            //         isActive: false,
            //       }),
            //     );
            //     dispatch(resetStories({index: 0}));
            //     scrollRef?.current?.scrollTo({x: 0 * width});
            //   } else {
            //     console.log('Não é last story ======>');
            //     await dispatch(
            //       changeActiveStory({
            //         index: currentStoryIndex + 1,
            //         isActive: true,
            //       }),
            //     );
            //     await dispatch(
            //       changeActiveStory({
            //         index: currentStoryIndex,
            //         isActive: false,
            //       }),
            //     );
            //     scrollRef?.current?.scrollTo({x: (index + 1) * width});
            //   }
            // } else {
            //   console.log('Não é last image ===>');
            //   // dispatch(next());
            //   dispatch(next({storyindex: index}));
            // }
            // // dispatch(next({storyindex: index}));
          }}
        />
      ))}
    </View>
  );
};

export default ButtonContainerStory;
