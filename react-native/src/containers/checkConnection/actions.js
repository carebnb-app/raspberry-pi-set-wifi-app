import { createAction } from 'redux-act'

import * as api from '../../api'

export const setStatus = createAction('SET_CHECK_CONNECTION_STATUS')
export const getWifiStatus = createAction('GET_WIFI_STATUS', api.getWifiStatus)
export const putApDisable = createAction('PUT_AP_DISABLE', api.putApDisable)