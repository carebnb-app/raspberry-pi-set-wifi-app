import { Alert as AlertRN } from 'react-native'

export default function Alert (a, b) {
  AlertRN.alert(a, b)
}

export function Confirm ({ title, message, okText = 'OK', onCancel, onOk }) {
  AlertRN.alert(
    title,
    message,
    [
      {
        text: 'Cancelar',
        onPress: onCancel,
        style: 'cancel',
      },
      { text: okText, onPress: onOk },
    ],
    {cancelable: false},
  );
}
