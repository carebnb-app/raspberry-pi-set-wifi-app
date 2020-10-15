import { combineReducers } from 'redux'
import { reducer as isLoading } from '../helpers/reducerPromiseHelper'
import setupWifi from '../containers/setupWifi/reducer'
import checkConnection from '../containers/checkConnection/reducer'

export default combineReducers({
  isLoading,
  setupWifi,
  checkConnection
})
