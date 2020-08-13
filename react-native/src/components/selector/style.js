import { StyleSheet } from 'react-native'

import { scale } from '../../helpers/scale'

export default StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    padding: scale(20),
    backgroundColor: '#fff'
  },

  search: {
    marginTop: scale(20)
  },

  close: {
    position: 'absolute',
    right: scale(20),
    marginTop: scale(20)
  }
})
