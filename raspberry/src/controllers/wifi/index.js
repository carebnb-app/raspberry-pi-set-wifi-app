import * as wifi from '../../services/wifi'

export const list = async () => {
  return wifi.scan()
}

export const connect = async ({ params }) => {
  if (!params.ssid) throw new Error('INVALID_PARAMS')

  const result = await wifi.connect(params.ssid, params.password)

  wifi.disableAccessPoint()

  return result
}
