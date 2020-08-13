import { useState, useEffect } from 'react'

import WifiManager from 'react-native-wifi-reborn'

import { usePermissionsNetworkAndroid } from './usePermissionsNetworkAndroid'

export function useIsConnectedToNetwork (ssid, ms = 5000) {
  const [isGranted] = usePermissionsNetworkAndroid()

  const [isConnected, setIsConnected] = useState(false)
  useEffect(() => {
    if (!isGranted) return undefined

    let timeout = null
    const checkNetwork = () => {
      WifiManager.getCurrentWifiSSID()
        .then(actualSsid => {
          if (actualSsid === ssid) setIsConnected(true)
          else setIsConnected(false)

          timeout = setTimeout(checkNetwork, ms)
        }).catch(() => {
          setIsConnected(false)
          timeout = setTimeout(checkNetwork, ms)
        })
    }

    checkNetwork()

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isGranted, setIsConnected, ssid, ms])

  return [isConnected]
}
