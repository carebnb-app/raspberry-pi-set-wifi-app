
import connect from './helpers/connect'

import * as Wifi from './controllers/wifi'
import * as Status from './controllers/status'

export default function routes (router) {
  router.get('/wifi/list', connect(Wifi.list))
  router.get('/wifi/status', connect(Wifi.checkConnection))
  router.post('/wifi/connect', connect(Wifi.connect))
  router.post('/ap/disable', connect(Wifi.disable))
  router.get('/status', connect(Status.all))
}
