import React, { useLayoutEffect, useMemo } from 'react'
import { View, Text, Button } from 'react-native'
import style from './style'
import * as config from '../../../config'
import { openSettings } from '../../helpers/openSettings'

export default function ConnectToNetwork ({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: ' ',
      headerTitle: 'Carebnb device setup'
    })
  }, [navigation])

  return (
    <View style={style.container}>
      <View style={style.inside}>
        <Text style={style.text}>Connect this device to the network</Text>
        <Text style={style.bold}>"{config.DEFAULT_NETWORK_NAME}"</Text>
        <Button onPress={openSettings} title='Connect to network' />
      </View>
    </View>
  )
}
