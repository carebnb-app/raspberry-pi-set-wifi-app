import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import * as RNLocalize from 'react-native-localize'

import { View, Button } from 'react-native'

import Status from '../../components/status'
import KeyboardAwareness from '../../components/keyboardAwareness'
import Selector from '../../components/selector'
import TextInput from '../../components/textInput'

import alert from '../../helpers/alert'

import * as actions from './actions'

import style from './style'

function useDispatcher () {
  const dispatch = useDispatch()

  return useMemo(() => ({
    getStatus: data => dispatch(actions.getStatus(data)),
    getNetworks: data => dispatch(actions.getNetworks(data)),
    connect: data => dispatch(actions.connect(data))
  }), [dispatch])
}

export default function SetNetworkInRaspberry ({ route, navigation }) {
  const { getStatus, getNetworks, connect } = useDispatcher()

  const [ssid, setSsid] = useState(route.params?.ssid || '')
  const [password, setPassword] = useState(route.params?.password || '')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: ' ',
      headerTitle: 'Configurar...'
    })
  }, [navigation])

  const status = useSelector(d => d.setNetworkInRaspberry.status)
  const _networks = useSelector(d => d.setNetworkInRaspberry.networks)
  const isLoading = useSelector(d => d.isLoading[actions.connect])
  const isLoadingNetworks = useSelector(d => d.isLoading[actions.getNetworks])

  useEffect(() => {
    if (status === 'success') getNetworks()
  }, [status, getNetworks])

  const networks = useMemo(() => {
    return _networks.map(d => ({ name: d.ssid, value: d.ssid }))
  }, [_networks])

  useEffect(() => {
    getStatus()
  }, [getStatus])

  const submit = async () => {
    try {
      await connect({ 
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
            placeholder='Selecionar rede...'
            options={networks}
            value={ssid}
            isLoading={isLoadingNetworks}
            onChangeText={setSsid}
          />
          <TextInput
            secureTextEntry
            placeholder='Senha...'
            value={password}
            autoCapitalize='none'
            autoCompleteType='password'
            onChangeText={setPassword}
          />
          <Button
            onPress={submit}
            disabled={!(password && ssid) || isLoading}
            title={isLoading ? 'Carregando...' : 'Configurar rede'}
          />
        </View>
      </KeyboardAwareness>
      {['pending', 'failed'].includes(status) && (
        <Status status={status} onPress={getStatus} />
      )}
    </>
  )
}
