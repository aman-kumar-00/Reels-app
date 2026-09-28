import React from 'react';

import {
  BottomTabBar,
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';




import ForYou from '../screens/ForYou';
import Home from '../screens/Home';
import MyList from '../screens/MyList';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

function CustomTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const bottom = Math.max(insets.bottom, 10);

  return (
    <View
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}>

      <View
        style={[
          styles.barWrap,
          {
            bottom,
          },
        ]}>

        <BottomTabBar {...props} />

      </View>

    </View>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}

      screenOptions={({route}) => ({
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: '#ff3b30',
        tabBarInactiveTintColor: '#8e8e93',

        tabBarStyle: styles.tabBar,

       tabBarIcon: ({focused}) => {
  let icon = null;

  if (route.name === 'ForYou') {
    icon = require('../assets/play-video.png');
  }

  if (route.name === 'Home') {
    icon = require('../assets/home.png');
  }

  if (route.name === 'MyList') {
    icon = require('../assets/save-instagram.png');
  }

  if (route.name === 'Profile') {
    icon = require('../assets/user.png');
  }

  return (
    <Image
      source={icon}
      resizeMode="contain"
      style={[
        styles.tabIcon,
        {
          tintColor: focused ? '#ff3b30' : '#8e8e93',
        },
      ]}
    />
  );
},
      })}>

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
}

const styles = StyleSheet.create({
  barWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  tabBar: {
    backgroundColor: '#000',
    borderTopWidth: 0,

    height: 64,

    paddingTop: 8,
    paddingBottom: 8,
  },

  tabIcon: {
    width: 30,
    height: 30,

    opacity: 0.65,
  },

  tabIconFocused: {
    opacity: 1,

    transform: [
      {
        scale: 1.06,
      },
    ],
  },
});