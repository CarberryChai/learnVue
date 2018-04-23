import { observe } from "./observer";
import Watcher from "./watcher";

export default class Vue {
  constructor(options={}){
    if (!(this instanceof Vue)) {
      throw TypeError('Please use new operator invoke Vue constructor')
    }
    this.init(options)
  }

  init(options){
    this.$el = options.el;
    let data = this.$data = options.data;
    Object.keys(data).forEach(key => this._proxy(this, key))
    observe(data)
  }

  $watcher(exp, cb, options){
    new Watcher(this, exp, cb)
  }

  _proxy(vm, key){
    Object.defineProperty(vm, key, {
      enumerable:true,
      configurable:true,
      get:function () {
        return vm.$data[key]
      },
      set:function (val) {
        vm.$data[key] = val
      }
    })
  }
}
