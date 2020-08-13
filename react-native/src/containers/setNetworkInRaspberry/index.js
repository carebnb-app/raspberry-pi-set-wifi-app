import React, { useState, useMemo, useEffect, useLayoutEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

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

export default function SetNetworkInRaspberry ({ navigation }) {
  const { getStatus, getNetworks, connect } = useDispatcher()

  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: ' ',
      headerTitle: 'Configurar...'
    })
  }, [navigation])

  const status = useSelector(d => d.setNetworkInRaspberry.status)
  const _networks = useSelector(d => d.setNetworkInRaspberry.networks)
  const isLoading = useSelector(d => d.isLoading[actions.connect])

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
      await connect({ ssid, password })
      alert('Sucesso!', 'Configurado com sucesso!')
    } catch (err) {
      if (String(err).includes('Network Error')) {
        alert('Sucesso!', 'Configurado com sucesso!')
      } else {
        alert(
          'Oops',
          err.response ? err.response.data.message : err.message
        )
      }
    }
  }

  return (
    <>
      <KeyboardAwareness>
        <View style={style.container}>
          <Selector
            placeholder='Selecionar rede...'
            options={networks}
            value={ssid}
            onChangeText={setSsid}
          />
          <TextInput
            secureTextEntry
            placeholder='Senha...'
            value={password}
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
