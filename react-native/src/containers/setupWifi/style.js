import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  header: {
    backgroundColor: '#EB5757'
  },

  headerTitle: {
    color: '#ffffff'
  },

  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  scrollView: {
    width: '100%',
    flex: 1,
    padding: '10%'
  },

  inside: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 100,
    height: 100
  },

  bottom: {
    justifyContent: 'flex-end',
    marginBottom: 36,
    marginTop: 20,
    width: '80%',
  }
})
