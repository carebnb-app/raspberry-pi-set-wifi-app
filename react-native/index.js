/**
 * @format
 */

import 'react-native-gesture-handler'

import React from 'react'

import { AppRegistry } from 'react-native'

import store from './src/state/store'

import { Provider } from 'react-redux'

import { name as appName } from './app.json'

import Routes from './src/routes'

const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
)

AppRegistry.registerComponent(appName, () => App)
