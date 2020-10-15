import React, { useLayoutEffect, useMemo } from 'react'
import { View, Text, Button } from 'react-native'
import style from './style'
import * as config from '../../../config'
import { openSettings } from '../../helpers/openSettings'
import LottieView from 'lottie-react-native'

export default function ConnectToNetwork ({ navigation }) {
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
          <LottieView source={require('../../assets/lottie/wifi-connection.json')} autoPlay loop />
        </View>
        <Text style={style.desc}>Connect this phone{"\n"}to a network called</Text>
        <Text style={style.bold}>"{config.DEFAULT_NETWORK_NAME}"</Text>
      </View>
      <View style={style.bottom}>
        <Button style={style.actionButton} onPress={openSettings} title='Connect' color='#EB5757' />
      </View>
    </View>
  )
}
