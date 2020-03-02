import React from 'react';
import ChatList from './ChatList';
import Profile from './Profile';
import Contact from './Contact';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Icon } from 'react-native-elements';

const Tab = createMaterialTopTabNavigator();

function Navigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: { color: '#FFF' },
        tabStyle: { width: 100 },
        style: { backgroundColor: '#051E34' },
        indicatorStyle: { backgroundColor: '#FFF' },
      }}>
      <Tab.Screen
        name="ChatList"
        component={ChatList}
        options={{
          title: 'Chats',
        }}
      />
      <Tab.Screen name="Contact" component={Contact} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default Navigator;
