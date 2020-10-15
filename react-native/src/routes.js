import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as config from '../config'
import { useIsConnectedToNetwork } from './helpers/useIsConnectedToNetwork'
import Home from './containers/home'
import SetupWifi from './containers/setupWifi'
import CheckConnection from './containers/checkConnection'

const Stack = createStackNavigator()

export default function Routes () {
  const [isConnectedToCarebnb] = useIsConnectedToNetwork(config.DEFAULT_NETWORK_NAME)

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* {isConnectedToCarebnb ? (
          <Stack.Screen name='SetupWifi' component={SetupWifi} />
        ) : (
          <Stack.Screen name='Home' component={Home} />
        )} */}
        <Stack.Screen name='SetupWifi' component={SetupWifi} />
        <Stack.Screen name='CheckConnection' component={CheckConnection} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
