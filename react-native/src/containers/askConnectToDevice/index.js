import React, { useLayoutEffect, useMemo } from 'react'
import { View, Text, Button } from 'react-native'
import style from './style'
import * as config from '../../../config'
import { openSettings } from '../../helpers/openSettings'
import LottieView from 'lottie-react-native'

export default function AskConnectToDevice ({ navigation }) {
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
        <Text style={style.desc}>Turn your Carebnb device on{"\n"}and connect this phone{"\n"}to its network named</Text>
        <Text style={style.bold}>"{config.DEFAULT_NETWORK_NAME}"</Text>
        <Text style={style.descLight}>If you can't find the network in the list,{"\n"}wait a few minutes and retry</Text>
      </View>
      <View style={style.bottom}>
        <Button style={style.actionButton} onPress={openSettings} title='Connect' color='#EB5757' />
      </View>
    </View>
  )
}
