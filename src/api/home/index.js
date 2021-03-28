import instance from '../config/index'
import qs from 'qs'
export default {
  getCode(data) {
    return instance.post(instance.wapUrlWeb + "/sms", qs.stringify(data))
  },
  Weblogin(data) {
    return instance.post(instance.wapUrlWeb + "/login", qs.stringify(data))
  },
  bsms(data) {
    return instance.post(instance.wapUrlWeb + "/b-sms", qs.stringify(data))
  },
  index(data) {
    return instance.post(instance.wapUrlWeb + "/index", qs.stringify(data))
  },
  course(data) {
    return instance.post(instance.wapUrlWeb + "/course", qs.stringify(data))
  },
  catalog(data) {
    return instance.post(instance.wapUrlWeb + "/catalog", qs.stringify(data))
  },
  chapter(data) {
    return instance.post(instance.wapUrlWeb + "/chapter", qs.stringify(data))
  },
  hvala(data) {
    return instance.post(instance.wapUrlWeb + "/hvala", qs.stringify(data))
  },

  
}
