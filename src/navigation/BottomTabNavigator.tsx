import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ForYou from '../screens/ForYou';
import Home from '../screens/Home';
import MyList from '../screens/MyList';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#ff3b30',
        tabBarInactiveTintColor: '#8e8e93',

        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 0,
          height: 65,
          paddingTop: 6,
          paddingBottom: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>

      <Tab.Screen
        name="ForYou"
        component={ForYou}
        options={{
          title: 'For You',
        }}
      />

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
        }}
      />

      <Tab.Screen
        name="MyList"
        component={MyList}
        options={{
          title: 'My List',
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
        }}
      />

    </Tab.Navigator>
  );
};

export default BottomTabNavigator;