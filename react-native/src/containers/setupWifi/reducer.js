import { createReducer } from 'redux-act'
import { getProperties, getWifiList } from './actions'
import { fulfilled, rejected, pending } from '../../helpers/reducerPromiseHelper'

const initialState = {
  status: 'pending',
  networks: []
}

export default createReducer({
  [fulfilled(getWifiList)]: (state, payload) => ({
    ...state,
    networks: payload.data
  }),

  [fulfilled(getProperties)]: (state, payload) => ({
    ...state,
    status: payload.data.name ? 'success' : 'failed'
  }),

  [rejected(getProperties)]: (state) => ({
    ...state,
    status: 'failed'
  }),

  [pending(getProperties)]: (state) => ({
    ...state,
    status: 'pending'
  })
}, { ...initialState })
