import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './main';
import AppNavigator from './app';
import AuthNavigator from './auth';
import LoginScreen from '../../Auth/Login';
import RegisterScreen from '../../Auth/Register';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase';
import { connect } from 'react-redux';

const Stack = createStackNavigator();

function Navigator(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {props.auth.isLogin ? (
          <Stack.Screen
            name="App"
            component={AppNavigator}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    app: state.app,
  };
};

export default connect(mapStateToProps)(Navigator);
