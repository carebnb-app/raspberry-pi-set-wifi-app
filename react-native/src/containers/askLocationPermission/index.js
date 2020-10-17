import React, { useLayoutEffect, useState } from 'react'
import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native'
import style from './style'
import LottieView from 'lottie-react-native'

export default function AskLocationPermission ({ navigation, route }) {
  const [isGranted, setGranted] = useState(Platform.select({ ios: true, android: false }))

  const askPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setGranted(true)
        navigation.replace('AskConnectToDevice', route.params)
      } else {
        setGranted(false)
      }
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: ' ',
      headerTitle: 'Carebnb device setup',
      headerStyle: style.header,
      headerTitleStyle: style.headerTitle
    })
  }, [navigation])

  return (
    <View style={style.container}>
      <View style={style.inside}>
        <View style={style.lottieView}>
          <LottieView source={require('../../assets/lottie/location-permissions.json')} autoPlay loop />
        </View>
        <Text style={style.desc}>To set up your Carebnb device,{"\n"}we need your location</Text>
        <Text style={style.bold}>Allow us to know your location</Text>
      </View>
      <View style={style.bottom}>
        <Button style={style.actionButton} onPress={askPermission} title='Give permission' color='#EB5757' />
      </View>
    </View>
  )
}
