import React, { useMemo, useEffect, useLayoutEffect } from 'react'

import { View, Text, Button, ActivityIndicator } from 'react-native'

import style from './style'

import * as config from '../../../config'

import * as actions from './actions'
import { useDispatch, useSelector } from 'react-redux'

import { useIsConnectedToNetwork } from '../../helpers/useIsConnectedToNetwork'

import WifiManager from 'react-native-wifi-reborn'

import alert from '../../helpers/alert'

function useDispatcher () {
  const dispatch = useDispatch()

  return useMemo(() => ({
    setStatus: data => dispatch(actions.setStatus(data)),
    checkConnection: data => dispatch(actions.checkConnection(data)),
    disableAccessPoint: data => dispatch(actions.disableAccessPoint(data))
  }), [dispatch])
}


export default function CheckConnection ({ navigation, route }) {
  const { setStatus, checkConnection, disableAccessPoint } = useDispatcher()

  const status = useSelector(d => d.checkConnection.status)

  const [isConnected] = useIsConnectedToNetwork(config.DEFAULT_NETWORK_NAME)

  const { ssid } = route.params

  useEffect(() => {
    WifiManager.getCurrentWifiSSID().then(actualSsid => {
      if (config.DEFAULT_NETWORK_NAME !== actualSsid) {
        return WifiManager.connectToSSID(config.DEFAULT_NETWORK_NAME)
      }
    })
  }, [])

  useEffect(() => {
    if (isConnected) { 
      setStatus('check-connection')
    } else {
      setStatus('await')
    }
  }, [isConnected, setStatus])

  useEffect(() => {
    if (status === 'check-connection') {
      setTimeout(async () => {
        try {
          const { value: { data: { status } } } = await checkConnection()
          setStatus(status)
          if (status === 'connected') {
            alert(
              'Sucesso!',
              'Conectado com sucesso!'
            )
            disableAccessPoint()
            navigation.goBack()
          }
        } catch (err) {
          return alert(
            'Oops',
            err.response ? err.response.data.message : err.message
          )
        }
      }, 4000)
    }
  }, [status, setStatus, checkConnection])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: ' ',
      headerTitle: 'Verificando conexão'
    })
  }, [navigation])

  return (
    <View style={style.container}>
      <View style={style.inside}>
        {['connected', 'disconnected'].includes(status) === false && (
          <ActivityIndicator style={style.indicator} size="large" />
        )}
        <Text style={style.text}>Verificando conexão com {ssid}</Text>
        <Text style={style.wifiText}>
          {status === 'await' && 'Aguardando conexão...'}
          {status === 'check-connection' && 'Verificando conexão...'}
          {status === 'disconnected' && 'Não foi possivel realizar a conexão. Tente novamente.'}
        </Text>
        <Button onPress={() => navigation.goBack()} title='Voltar' />
      </View>
    </View>
  )
}