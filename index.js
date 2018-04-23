import Vue from "./vue";

const vm = new Vue({
  el: '#app',
  data:{
    text:'Hello',
    product:{
      id:123,
      price:56,
      name:'apple'
    }
  }
})
vm.$watcher('text',() => {
  console.log(`text的值发生了改变`);
})
setTimeout(() => {
  vm.text = 'world!'
}, 2000);
