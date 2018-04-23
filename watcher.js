import { pushTarget } from "./dep";

export default class Watcher{
  constructor(vm, exp, cb){
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.value = this.get()
  }

  get(){
    pushTarget(this)
    const value = this.vm.$data[this.exp]
    return value
  }

  update(){
    console.log('view更新')
  }
}