import * as wifi from '../../services/wifi'

export const list = async () => {
  return wifi.scan()
}

export const checkConnection = async () => {
  return { status: wifi.checkIfIsConnected() ? 'connected' : 'disconnected' }
}

export const disable = async () => {
  wifi.disableAccessPoint()

  return { status: 'disabling' }
}

export const connect = async ({ params }) => {
  if (!params.ssid) throw new Error('INVALID_PARAMS')

  const result = await wifi.connect(params.ssid, params.password)

  // wifi.disableAccessPoint()

  return result
}
