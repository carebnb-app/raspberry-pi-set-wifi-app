import React, { useMemo, useEffect, useLayoutEffect } from 'react'

import { View, Text, Button, ActivityIndicator } from 'react-native'

import style from './style'

import * as config from '../../../config'

import * as actions from './actions'
import { useDispatch, useSelector } from 'react-redux'

import { openSettings } from '../../helpers/openSettings'

import { useIsConnectedToNetwork } from '../../helpers/useIsConnectedToNetwork'

import alert from '../../helpers/alert'

import { connectToSSID, getCurrentWifiSSID } from '../../helpers/connectToSsid'

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
    const timeout = setTimeout(() => {
      if (isConnected === false) {
        setStatus('connecting')
        connectToSSID(config.DEFAULT_NETWORK_NAME)
          .then(() => setStatus('check-connection'))
          .catch(() => {
            getCurrentWifiSSID().then(ssid => {
              if (ssid !== config.DEFAULT_NETWORK_NAME) setStatus('failed-connection')
            })
          })
      }
    }, 15000)

    return () => clearTimeout(timeout)
  }, [isConnected, setStatus, checkConnection, navigation])

  useEffect(() => {
    if (isConnected) { 
      setStatus('check-connection')
    } else {
      setStatus('await')
    }
  }, [isConnected, setStatus])

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (status === 'check-connection') {
        try {
          const { value: { data: { status } } } = await checkConnection()
          setStatus(status)
          if (status === 'connected') {
            alert(
              'Sucesso!',
              'Conectado com sucesso!'
            )
            setTimeout(() => {
              disableAccessPoint()
            }, 2000)
          }
        } catch (err) {
          return alert(
            'Oops',
            err.response ? err.response.data.message : err.message
          )
        }
      }
    }, 32000)

    return () => timeout && clearTimeout(timeout)
  }, [status, setStatus, checkConnection])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: ' ',
      headerTitle: 'Verificando conexão'
    })
  }, [navigation])


  const goBack = () => {
    navigation.replace(isConnected ? 'SetNetworkInRasoberry' : 'ConnectToNetwork', route.params)
  }

  return (
    <View style={style.container}>
      <View style={style.inside}>
        {['connected', 'disconnected'].includes(status) === false && (
          <ActivityIndicator style={style.indicator} size="large" />
        )}
        <Text style={style.text}>Verificando conexão com {ssid}</Text>
        <Text style={style.wifiText}>
          {status === 'connecting' && `Conectando com a rede ${config.DEFAULT_NETWORK_NAME}`}
          {status === 'failed-connection' && `Não foi possivel conectar a rede ${config.DEFAULT_NETWORK_NAME}`}
          {status === 'await' && 'Aguardando conexão...'}
          {status === 'check-connection' && 'Verificando conexão...'}
          {status === 'disconnected' && `Não foi possivel realizar a conexão com a rede ${ssid}. Tente novamente.`}
        </Text>
        {status === 'failed-connection' && <Button onPress={openSettings} title='Conectar manualmente' />}
        <Button onPress={goBack} title='Voltar' />
      </View>
    </View>
  )
}