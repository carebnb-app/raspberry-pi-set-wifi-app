import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  alert: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
    marginTop: -150
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  inside: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center'
  },

  text: {
    textAlign: 'center',
    fontSize: 18
  },

  bold: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20
  }
})
