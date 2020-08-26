import axios from 'axios'

import * as config from '../../config'

export const status = async () => {
  return axios.get(`${config.API_URL}/status`, {
    timeout: 30 * 60 * 1000
  })
}

export const networks = async () => {
  return axios.get(`${config.API_URL}/wifi/list`)
}

export const connect = async data => {
  return axios.post(`${config.API_URL}/wifi/connect`, data, {
    timeout: 15000
  })
}

export const checkConnection = async () => {
  return axios.get(`${config.API_URL}/wifi/status`)
}

export const disableAccessPoint = async () => {
  return axios.post(`${config.API_URL}/ap/disable`)
}