import { useState, useEffect } from 'react'
import WifiManager from 'react-native-wifi-reborn'

export function useIsConnectedToNetwork (ssid, ms = 5000) {
  const [isConnected, setIsConnected] = useState(false)
  useEffect(() => {
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
  }, [setIsConnected, ssid, ms])

  return [isConnected]
}
