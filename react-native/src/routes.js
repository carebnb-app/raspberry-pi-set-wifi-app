import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AskConnectToDevice from './containers/askConnectToDevice'
import SetupWifi from './containers/setupWifi'
import CheckConnection from './containers/checkConnection'
import AskLocationPermission from './containers/askLocationPermission'
import Home from './containers/home'

const Stack = createStackNavigator()

export default function Routes () {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='AskLocationPermission' component={AskLocationPermission} />
        <Stack.Screen name='AskConnectToDevice' component={AskConnectToDevice} />
        <Stack.Screen name='SetupWifi' component={SetupWifi} />
        <Stack.Screen name='CheckConnection' component={CheckConnection} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
