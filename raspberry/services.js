import * as wifi from './src/services/wifi'

const properties = new Map()

export const set = (key, value) => properties.set(key, value)
export const get = (key) => properties.get(key)

async function wifiService () {
  if(wifi.checkIfIsConnected()){
    console.log('Wifi already connected')
    wifi.disableAccessPoint(() => {
      console.log('Access point disabled on startup')
    })
  }
  else{
    wifi.enableAccessPoint(() => {
      console.log('Access point enabled on startup')
    })
  }
}

async function run () {
  await wifiService()
}

run().catch(err => console.error(err))
