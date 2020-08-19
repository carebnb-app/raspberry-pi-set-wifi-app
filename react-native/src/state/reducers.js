import { combineReducers } from 'redux'

import { reducer as isLoading } from '../helpers/reducerPromiseHelper'

import setNetworkInRaspberry from '../containers/setNetworkInRaspberry/reducer'
import checkConnection from '../containers/checkConnection/reducer'

export default combineReducers({
  isLoading,
  setNetworkInRaspberry,
  checkConnection
})
