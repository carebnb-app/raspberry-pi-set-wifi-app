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
            <Text style={style.title}>Verifying Carebnb device...</Text>
          </>
        )}
        {status === 'failed' && (
          <>
            <Text style={style.title}>Couldn't retrieve device state</Text>
            <Button title='Try again' onPress={onPress} />
          </>
        )}
      </View>
    </ModalRN>
  )
}
