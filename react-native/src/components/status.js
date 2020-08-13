import React from 'react'

import { Text, Modal as ModalRN, View, ActivityIndicator, Button } from 'react-native'

import style from './style'
export default function Modal ({ status, onPress }) {
  return (
    <ModalRN visible transparent>
      <View style={style.container}>
        {status === 'pending' && (
          <>
            <ActivityIndicator color='#000' size='large' />
            <Text style={style.title}>Verificando dispositivo...</Text>
          </>
        )}
        {status === 'failed' && (
          <>
            <Text style={style.title}>Encontramos algo de errado</Text>
            <Button title='Tentar novamente' onPress={onPress} />
          </>
        )}
      </View>
    </ModalRN>
  )
}
