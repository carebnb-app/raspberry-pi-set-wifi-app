import * as api from '../../api'
import { createAction } from 'redux-act'

export const getProperties = createAction('GET_PROPERTIES', api.getProperties)
export const getWifiList = createAction('GET_WIFI_LIST', api.getWifiList)
export const postWifiConnect = createAction('POST_WIFI_CONNECT', api.postWifiConnect)
