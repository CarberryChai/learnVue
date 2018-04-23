## vue响应式原理学习

vue响应式原理的本质就是依赖追踪，只要理清`Observer`、`Dep`、`Watcher`三者之间的关系。

`Observer`负责把数据对象`data`转换为响应式的，即用`Object.defineProperty`方法把`data`对象的每一个属性都设置为访问器属性。
```js
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
```
`Dep`是一个依赖收集器，把对`data`下的某个属性的依赖（即watcher）用一个数组收集起来，当属性的值发生改变时，发出`notify`。每一个属性都有一个`Dep`实例对象用来管理它自己的依赖。

`Watcher`就是观测者，观测某一个值，当这个值发生改变的时候做一些事情。
```js
new Watcher(vm, expOrFn, cb)
```
对某个属性进行观测的时候，`data`已经是响应式的了，所以我们对表达式求值即`data[exp]`就会触发`getter`，在求值之前呢！我们把这个`Watcher`收集起来，
```js
Dep.target = null;
export function pushTarget(watcher) {
 Dep.target = watcher;
}
```
即：
```js
pushTarget(this)
data[exp] //触发getter，在getter中把watcher添加到依赖收集队列里
```