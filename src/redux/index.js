import {configureStore} from '@reduxjs/toolkit';

import storiesReducer from './slices/stories.slice';

export default configureStore({
  reducer: {
    stories: storiesReducer,
  },
});
