import { StyleSheet } from 'react-native'

import { scale } from '../../helpers/scale'

export default StyleSheet.create({
  normal: {
    fontSize: scale(20),
    height: scale(42),
    color: 'rgb(44, 44, 44)'
  },
  hilight: {
    color: 'rgb(153, 153, 153)'
  }
})
