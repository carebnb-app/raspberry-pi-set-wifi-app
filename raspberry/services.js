import * as wifiServices from './src/services/wifi'

import { sleep } from './src/helpers/sleep'

import * as config from './config'

const properties = new Map()

export const set = (key, value) => properties.set(key, value)
export const get = (key) => properties.get(key)

async function wifiService () {
  const isConnected = config.FORCE_ACCESSPOINT === '1' ? false : wifiServices.checkIfIsConnected()

  await wifiServices.disableAccessPoint()

  await sleep(10000)

  await wifiServices.enableAccessPoint()

  if (isConnected) {
    const autoConnect = setTimeout(async () => {
      console.log('AUTOCONNECT')
      await wifiServices.disableAccessPoint()
    }, 120000)

    set('autoConnect', autoConnect)
  }
}

async function run () {
  await wifiService()
}

run().catch(err => console.error(err))
