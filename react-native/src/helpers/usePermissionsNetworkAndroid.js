import { useEffect, useState } from 'react'

import { PermissionsAndroid, Platform } from 'react-native'

export function usePermissionsNetworkAndroid () {
  const [isGranted, setGranted] = useState(Platform.select({ ios: true, android: false }))

  useEffect(() => {
    if (Platform.OS === 'android') {
      ;(async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Precisamos acessar sua localização',
            message: 'Para podermos localizar as redes wifi precisamos de acesso a sua localização',
            buttonNegative: 'Negar',
            buttonPositive: 'Permitir'
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
