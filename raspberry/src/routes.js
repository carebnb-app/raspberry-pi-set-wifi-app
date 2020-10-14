import connect from './helpers/connect'
import * as controller from './controllers'

export default function routes (router) {
  router.get('/properties', connect(controller.getProperties))
  router.post('/properties', connect(controller.postProperties))
  router.get('/wifi/list', connect(controller.getWifiList))
  router.get('/wifi/status', connect(controller.getWifiStatus))
  router.post('/wifi/connect', connect(controller.postWifiConnect))
}
