import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  header: {
    backgroundColor: '#EB5757'
  },

  headerTitle: {
    color: '#ffffff'
  },

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
    justifyContent: 'center',
    flex: 10
  },

  desc: {
    textAlign: 'center',
    fontSize: 18,
    margin: 20
  },

  bold: {
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20
  },

  lottieView: {
    width: 200,
    height: 200
  },

  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    width: '80%',
  }
})
