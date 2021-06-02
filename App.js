/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// import {Asset} from 'expo-asset';
import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';

import store from './src/redux';

// import {SafeAreaView, StyleSheet} from 'react-native';
import Stories from './src/components/Stories';

import stories from './src/data/stories';
import stories2 from './src/data/stories2';

const App = () => {
  const [ready, setReady] = useState(false);

  /*  useEffect(() => {
    const request = async () => {
      await Promise.all(
        stories.map(story =>
          Promise.all([
            Asset.loadAsync(story.source),
            Asset.loadAsync(story.avatar),
          ]),
        ),
      );

      setReady(true);
    };

    request();
  }, []); */

  // console.log('{...{stories2}}', stories2.length);

  return (
    <Provider store={store}>
      <Stories {...{stories: stories2}} />
    </Provider>
  );
};

export default App;
