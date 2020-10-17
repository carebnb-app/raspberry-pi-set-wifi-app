import { useEffect, useState } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'

export function usePermissionsLocationAndroid () {
  const [isGranted, setGranted] = useState(Platform.select({ ios: true, android: false }))

  useEffect(() => {
    if (Platform.OS === 'android') {
      ;(async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'We need your location',
            message: 'To set up your device\'s wifi and location, we need your location',
            buttonNegative: 'Deny',
            buttonPositive: 'Allow'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setGranted(true)
        } else {
          setGranted(false)
        }
      })()
    }
  }, [setGranted])

  return [isGranted]
}
