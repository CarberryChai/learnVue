import Dep from "./dep";


export default class Observer{
  constructor(value){
    this.value = value;
    this.walk(value)
  }

  walk(data){
    const keys = Object.keys(data)
    keys.forEach(key => defineActive(data, key, data[key]))
  }
}
/**
 * 把data对象下的每一个属性都设置为访问器属性并且
 * 为每一个属性都配置了dep对象，用来收集依赖
 * 
 * @param {Object} data 
 * @param {any} key 
 * @param {any} val 
 */
function defineActive(data, key, val) {
  const property = Object.getOwnPropertyDescriptor(data, key);
  if (property.configurable === false) {
    return
  }
  //取出属性原有的getter和setter
  const getter = property.get;
  const setter = property.set;

  observe(val)
  const dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable:true,
    configurable:true,
    get:function activeGetter () {
      const value = getter ? getter.call(data) : val;
      if (Dep.target) { //依赖的目标即watcher
        dep.addDep(Dep.target)
      }
      return value;
    },
    set:function activeSetter(newVal) {
      const value = getter ? getter.call(data) : val;
      if (newVal === value) {
        return;
      }
      if (setter) {
        setter.call(data, newVal)
      }else{
        val = newVal;
      }
      observe(newVal)//观测新值
      dep.notify();//值改变，通知更新
    }
  })
}

export function observe(data) {
  //简单起见，只观测普通对象，Array等以后再加
  if (!(Object.prototype.toString.call(data) == "[object Object]")) {
    return
  }
  new Observer(data)
}