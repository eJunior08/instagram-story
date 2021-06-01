import {createSlice} from '@reduxjs/toolkit';

/* 

stories = [
  story,
  story,
  story,
]

story = {
  currentIndexImage: number; // current index of the imamge
  qtdImages: number;
  isActive: boolean; // tell if the story is showing
}

*/

const INITIAL_STATE = {
  images: [],
  currentStoryIndex: 0,

  stories: [],
};

const stories_slice = createSlice({
  name: 'stories',
  initialState: INITIAL_STATE,
  reducers: {
    initStories: (state, {payload: {qtdStories, arrQtdImages}}) => {
      state.stories = [...Array(qtdStories)].map((arr, index) => ({
        currentIndexImage: 0,
        qtdImages: arrQtdImages[index],
        isActive: false,
      }));

      state.stories[0].isActive = true;
    },
    next: (state, {payload}) => {
      if (!isNaN(payload.storyindex)) {
        const currentStory = state.stories[payload.storyindex];

        const isLastImage = !(
          currentStory.currentIndexImage <
          currentStory.qtdImages - 1
        );

        if (!isLastImage) {
          console.log('Não é ultima imagem');
          state.stories[payload.storyindex].currentIndexImage++;
        }
      } else {
        state.stories.forEach(
          story => story.isActive && story.currentIndexImage++,
        );
      }
    },
    prev: (state, {payload}) => {
      if (!isNaN(payload.storyindex)) {
        const currentStory = state.stories[payload.storyindex];

        const isFirstImage = currentStory.currentIndexImage === 0;

        if (!isFirstImage) {
          console.log('Não é a primeira imagem');
          state.stories[payload.storyindex].currentIndexImage--;
        }
      } else {
        state.stories.forEach(
          story => story.isActive && story.currentIndexImage--,
        );
      }
      /* if (payload.storyindex) {
        console.log('payload', payload);
        const currentStory = state.stories[payload.storyindex];
        console.log('currentStory', currentStory);
        if (currentStory.currentIndexImage > 0)
          state.stories[payload.storyindex].currentIndexImage--;
      } else {
        state.stories.forEach(
          story => story.isActive && story.currentIndexImage--,
        );
      } */
    },
    changeActiveStory: (state, {payload}) => {
      state.stories[payload.index].isActive = payload.isActive;
    },
    resetStories: state => {
      console.log('resetou');
      state.stories.forEach(s => {
        s.currentIndexImage = 0;
        s.isActive = false;
      });
    },

    create: (state, {payload}) => {
      state.images = [...Array(payload.totalStories)].map((arr, index) => ({
        index: 0,
        total: payload.stories[index].photos.length,
      }));
    },
    nextImage: (state, {payload}) => {
      const currentStory = state.images[payload.storyIndex];
      if (currentStory.index < currentStory.total - 1)
        state.images[payload.storyIndex].index++;
    },
    prevImage: (state, {payload}) => {
      const currentStory = state.images[payload.storyIndex];
      if (currentStory.index > 0) state.images[payload.storyIndex].index--;
    },
    updateCurrentStoryIndex: (state, {payload}) => {
      state.currentStoryIndex = payload.index;
      state.stories[payload.index].isActive = true;
    },
    reset: state => {
      state.currentStoryIndex = 0;
      state.images = state.images.map(arr => ({index: 0, total: arr.total}));
    },
  },
});

export const {
  initStories,
  next,
  prev,
  changeActiveStory,
  resetStories,

  create,
  nextImage,
  prevImage,
  updateCurrentStoryIndex,
  reset,
} = stories_slice.actions;

export default stories_slice.reducer;
