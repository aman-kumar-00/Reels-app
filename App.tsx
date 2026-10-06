import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';

import Login from './src/screens/Login';
import Signup from './src/screens/Signup';

import {AuthProvider} from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={
          isDarkMode
            ? 'light-content'
            : 'dark-content'
        }
      />

      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerShown: false,
            }}>

            <Stack.Screen
              name="Main"
              component={BottomTabNavigator}
            />

            <Stack.Screen
              name="Login"
              component={Login}
            />

            <Stack.Screen
              name="Signup"
              component={Signup}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;