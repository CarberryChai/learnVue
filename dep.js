export default class Dep{
  constructor(){
    this.subs = []
  }

  addDep(watcher){
    this.subs.push(watcher)
  }

  notify(){
    this.subs.forEach(watcher => {
      watcher.cb()
    })
  }
}
Dep.target = null;
export function pushTarget(watcher) {
 Dep.target = watcher;
}