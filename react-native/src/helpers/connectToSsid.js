import { Platform } from 'react-native'

import WifiManager from 'react-native-wifi-reborn'

export const getCurrentWifiSSID = () => {
  return new Promise((resolve) => {
    WifiManager.getCurrentWifiSSID()
      .then(ssid => {
        resolve(ssid)
      }).catch(() => {
        setTimeout(() => resolve(getCurrentWifiSSID()), 2000)
      })
  })
}

export const connectToSSID = async ssid => {
  if (await getCurrentWifiSSID() !== ssid) {
    if (Platform.OS === 'android') return WifiManager.connectToProtectedSSID(ssid, '', false)
    return WifiManager.connectToSSID(ssid)
  }
}