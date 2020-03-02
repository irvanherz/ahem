import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../../App/Home';
import PersonalChat from '../../App/PersonalChat';
import SelectContact from '../../App/SelectContact';
import FindContact from '../../App/FindContact';
import SelectLocation from '../../App/SelectLocation';
import ContactInfo from '../../App/ContactInfo';
import ViewUserLocation from '../../App/ViewUserLocation';

const Stack = createStackNavigator();
function Navigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#051E34',
        },
        headerTitleStyle: {
          color: '#FFF',
          fontWeight: 'bold',
        },
        headerTintColor: 'white',
        headerLeftContainerStyle: {
          color: '#FFF',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerStyle: {
            elevation: 0,
            backgroundColor: '#051E34',
          },

          headerTitleStyle: { color: '#FFF', fontWeight: 'bold' },
          headerTitle: 'Ahem!',
        }}
      />
      <Stack.Screen
        name="PersonalChat"
        component={PersonalChat}
        options={({ route }) => ({
          // headerTitle: `${route.params.receiverProfile.displayName} (${
          //   route.params.receiverProfile.email
          // })`,
        })}
      />
      <Stack.Screen
        name="SelectContact"
        component={SelectContact}
        options={{
          headerTitle: 'Select Contact',
        }}
      />
      <Stack.Screen
        name="FindContact"
        component={FindContact}
        options={{
          headerTitle: 'Find Contact',
        }}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        options={{
          headerTitle: 'Pick Location',
        }}
      />
      <Stack.Screen
        name="ViewUserLocation"
        component={ViewUserLocation}
        options={{
          headerTitle: 'User Location',
        }}
      />
      <Stack.Screen
        name="ContactInfo"
        component={ContactInfo}
        options={{
          headerTitle: 'Contact Info',
        }}
      />
    </Stack.Navigator>
  );
}

export default Navigator;
