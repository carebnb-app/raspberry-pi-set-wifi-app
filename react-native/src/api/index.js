import axios from 'axios'
import * as config from '../../config'

export const getProperties = async () => {
  return axios.get(`${config.API_URL}/properties`, {
    timeout: 1000 * 15
  })
}

export const postProperties = async data => {
  return axios.post(`${config.API_URL}/properties`, data)
}

export const getWifiList = async () => {
  return axios.get(`${config.API_URL}/wifi/list`)
}

export const getWifiStatus = async () => {
  return axios.get(`${config.API_URL}/wifi/status`)
}

export const postWifiConnect = async data => {
  return axios.post(`${config.API_URL}/wifi/connect`, data, {
    timeout: 1000 * 15
  })
}

export const putApDisable = async data => {
  return axios.put(`${config.API_URL}/ap/disable`, data)
}