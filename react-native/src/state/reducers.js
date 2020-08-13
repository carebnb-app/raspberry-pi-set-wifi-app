import { combineReducers } from 'redux'

import { reducer as isLoading } from '../helpers/reducerPromiseHelper'

import setNetworkInRaspberry from '../containers/setNetworkInRaspberry/reducer'

export default combineReducers({
  isLoading,
  setNetworkInRaspberry
})
