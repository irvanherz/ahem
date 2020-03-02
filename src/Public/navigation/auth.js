import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../Auth/Login';
import RegisterScreen from '../../Auth/Register';

const Stack = createStackNavigator();

function Navigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Navigator;
