import React, { useMemo, useEffect, useLayoutEffect } from 'react'
import { View, Text, Button, ActivityIndicator } from 'react-native'
import style from './style'
import * as config from '../../../config'
import * as actions from './actions'
import { useDispatch, useSelector } from 'react-redux'
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
    let timeout = null

    getCurrentWifiSSID().then(ssid => {
      if (ssid !== config.DEFAULT_NETWORK_NAME) {
        setStatus('connecting')
        timeout = setTimeout(() => {
          connectToSSID(config.DEFAULT_NETWORK_NAME)
            .then(() => setStatus('check-connection'))
            .catch(() => {
              getCurrentWifiSSID().then(ssid => {
                if (ssid !== config.DEFAULT_NETWORK_NAME) setStatus('failed-connection')
              })
            })
        }, 10000)
      } else {
        setStatus('check-connection')
      }
    })

    return () => timeout && clearTimeout(timeout)
  }, [setStatus, checkConnection, navigation])

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
              'All done!',
              'Your device is connected with success!'
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
    }, 15000)

    return () => timeout && clearTimeout(timeout)
  }, [status, setStatus, checkConnection])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: ' ',
      headerTitle: 'Checking connection'
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
        <Text style={style.text}>Verifying connection with {ssid}</Text>
        <Text style={style.bold}>
          {status === 'connecting' && `Connecting with ${ssid}`}
          {status === 'failed-connection' && `Couldn't connect with ${ssid}`}
          {status === 'await' && 'Waiting connection...'}
          {status === 'check-connection' && 'Verifying connection...'}
          {status === 'disconnected' && `Couldn't connect with ${ssid}. Please try again.`}
        </Text>
        {/* {status === 'failed-connection' && <Button onPress={openSettings} title='Connect manually' />} */}
        <Button onPress={goBack} title='Back' />
      </View>
    </View>
  )
}