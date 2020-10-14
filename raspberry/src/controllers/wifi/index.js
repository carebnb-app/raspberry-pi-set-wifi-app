import * as wifi from '../../services/wifi'

export const list = async () => {
  return wifi.scan()
}

export const checkConnection = async () => {
  return { status: wifi.checkIfIsConnected() ? 'connected' : 'disconnected' }
}

export const disable = async () => {
  wifi.disableAccessPoint(() => {
    console.log('Access point disabled from controller/wifi/disable')
  })
  return { status: 'disabled' }
}

export const connect = async ({ params }) => {
  if (!params.ssid) throw new Error('INVALID_PARAMS')
  const success = await wifi.connect(params.ssid, params.password, params.countryCode)
  if(success){
    wifi.disableAccessPoint(() => {
      console.log('Access point disabled from controller/wifi/connect')
    })
  }
  return { success }
}
