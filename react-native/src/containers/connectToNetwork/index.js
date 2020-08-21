import React, { useLayoutEffect, useMemo } from 'react'

import { Image, View, Text, Button } from 'react-native'

import style from './style'

import * as config from '../../../config'

import { openSettings } from '../../helpers/openSettings'

export default function ConnectToNetwork ({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: ' ',
      headerTitle: 'Conectar a rede...'
    })
  }, [navigation])

  return (
    <View style={style.container}>
      <View style={style.inside}>
        <Image style={style.alert} source={require('../../assets/alert.png')} />
        <Text style={style.text}>Para começarmos precisamos que você conecte a rede wifi do Carebnb.</Text>
        <Text style={style.wifiText}>"{config.DEFAULT_NETWORK_NAME}"</Text>
        <Button onPress={openSettings} title='Conectar a rede' />
      </View>
    </View>
  )
}
