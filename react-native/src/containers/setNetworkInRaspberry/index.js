import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as RNLocalize from 'react-native-localize'
import { View, Button } from 'react-native'
import Status from '../../components/status'
import KeyboardAwareness from '../../components/keyboardAwareness'
import Selector from '../../components/selector'
import TextInput from '../../components/textInput'
import * as actions from './actions'
import style from './style'

function useDispatcher () {
  const dispatch = useDispatch()

  return useMemo(() => ({
    getProperties: data => dispatch(actions.getProperties(data)),
    getWifiList: data => dispatch(actions.getWifiList(data)),
    postWifiConnect: data => dispatch(actions.postWifiConnect(data))
  }), [dispatch])
}

export default function SetNetworkInRaspberry ({ route, navigation }) {
  const { getProperties, getWifiList, postWifiConnect } = useDispatcher()
  const [ssid, setSsid] = useState(route.params?.ssid || '')
  const [password, setPassword] = useState(route.params?.password || '')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: ' ',
      headerTitle: 'Carebnb device setup'
    })
  }, [navigation])

  const status = useSelector(d => d.setNetworkInRaspberry.status)
  const _networks = useSelector(d => d.setNetworkInRaspberry.networks)
  const isLoading = useSelector(d => d.isLoading[actions.postWifiConnect])
  const isLoadingNetworks = useSelector(d => d.isLoading[actions.getWifiList])

  useEffect(() => {
    if (status === 'success') getWifiList()
  }, [status, getWifiList])

  const networks = useMemo(() => {
    return _networks.map(d => ({ name: d.ssid, value: d.ssid }))
  }, [_networks])

  useEffect(() => {
    getProperties()
  }, [getProperties])

  const submit = async () => {
    try {
      await postWifiConnect({ 
        ssid, 
        password, 
        countryCode: RNLocalize.getCountry()
      })
    } catch (err) {}

    navigation.navigate('CheckConnection', { ssid, password })
  }

  return (
    <>
      <KeyboardAwareness>
        <View style={style.container}>
          <Selector
            placeholder='Network name'
            options={networks}
            value={ssid}
            isLoading={isLoadingNetworks}
            onChangeText={setSsid}
          />
          <TextInput
            secureTextEntry
            placeholder='Network password'
            value={password}
            autoCapitalize='none'
            autoCompleteType='password'
            onChangeText={setPassword}
          />
          <Button
            onPress={submit}
            disabled={!(password && ssid) || isLoading}
            title={isLoading ? 'Connecting...' : 'Connect'}
          />
        </View>
      </KeyboardAwareness>
      {['pending', 'failed'].includes(status) && (
        <Status status={status} onPress={getProperties} />
      )}
    </>
  )
}
