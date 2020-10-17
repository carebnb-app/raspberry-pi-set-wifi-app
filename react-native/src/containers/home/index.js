import React, { useLayoutEffect, useState, useEffect } from 'react'
import { View, Text, Button, PermissionsAndroid, Platform, Image } from 'react-native'
import style from './style'
import { useIsConnectedToNetwork } from '../../helpers/useIsConnectedToNetwork'
import * as config from '../../../config'

export default function AskLocationPermission ({ navigation, route }) {
  const isAndroid = Platform.OS === 'android'
  const [hasLocationPermission, setHasLocationPermission] = useState(!isAndroid)
  const [hasCheckedLocationPermission, setHasCheckedLocationPermission] = useState(!isAndroid)
  const [isConnectedToCarebnbNetwork] = useIsConnectedToNetwork(config.DEFAULT_NETWORK_NAME)

  const startSetup = () => {
    if(hasLocationPermission){
      if(isConnectedToCarebnbNetwork){
        navigation.navigate('SetupWifi' , route.params)
      }
      else{
        navigation.navigate('AskConnectToDevice' , route.params)
      }
    }
    else{
      navigation.navigate('AskLocationPermission' , route.params)
    }
  }

  useEffect(() => {
    if (isAndroid && !hasLocationPermission) {
      ;(async () => {
        const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        setHasLocationPermission(isGranted)
        setHasCheckedLocationPermission(true)
      })()
    }
  }, [hasLocationPermission, hasCheckedLocationPermission])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation])

  return (
    <View style={style.container}>
      <View style={style.inside}>
        <View style={style.lottieView}>
          <Image source={require('../../assets/images/logoWhite.png')} style={style.imageView} />
        </View>
        <Text style={style.desc}>Welcome to Carebnb</Text>
        <Text style={style.bold}>Let's set up your device</Text>
      </View>
      <View style={style.bottom}>
        <Button
            style={style.actionButton}
            onPress={startSetup}
            title='Start setup'
            color='#EB5757'
            disabled={!hasCheckedLocationPermission} />
      </View>
    </View>
  )
}
