import * as wifi from '../services/wifi'
import * as config from '../../config'
import * as propertiesFile from '../services/properties-file'

/**
 * Used to return the description and properties of the device.
 * React app can use these properties to define decisions related to the device
 * being configured.
 */
export const getProperties = async () => {
  var customProperties
  try{
    customProperties = propertiesFile.read()
  } catch {
    customProperties = {}
  }
  return {
    name: config.PROJECT_NAME,
    ...customProperties
  }
}

/**
 * Add properties to the device.
 * It will save on the filesystem a json with received properties.
 * This can be useful if one wants to add custom setup to the device.
 */
export const postProperties = async ({ params, body }) => {
  propertiesFile.write(body)
  return { success: true }
}

/**
 * Return with a set of SSIDS and other wifi properties.
 */
export const getWifiList = async () => {
  return wifi.scan()
}

/**
 * Just says if the device is already connected to a wifi network or not.
 */
export const getWifiStatus = async () => {
  return { status: wifi.checkIfIsConnected() ? 'connected' : 'disconnected' }
}

/**
 * Connect to a wifi network.
 * Country is needed as wifis have different radio frequencies in different Countries.
 */
export const postWifiConnect = async ({ params }) => {
  if (!params.ssid || !params.countryCode) throw new Error('INVALID_PARAMS')
  var hasResponse = false
  wifi.connect(params.ssid, params.password, params.countryCode, (response) => {
    hasResponse = true
    success = response
  })

  // Stall waiting for connection to be concluded
  while(!hasResponse){}

  // Auto disable access point
  wifi.disableAccessPoint(() => {
    console.log('Access point disabled from controller/wifi/disable')
  })

  return { success }
}