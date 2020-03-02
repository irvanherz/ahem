import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Navigator from './src/Public/navigation';
import { Provider } from 'react-redux';
import { store, persistor } from './src/Public/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Splash from './Splash';

class App extends React.Component {
  render() {
    console.disableYellowBox = true;
    return (
      <>
        <StatusBar translucent backgroundColor="rgba(0,0,0,0.2)" />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Splash />
            <Navigator />
          </PersistGate>
        </Provider>
      </>
    );
  }
}

export default App;
