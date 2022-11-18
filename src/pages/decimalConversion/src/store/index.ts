import { action, observable, computed } from 'mobx'
import {
  makeObservable // fix: handle以后不刷新
} from 'mobx'

type IStores = IStore
class Store<IStores> {
  constructor() {
    makeObservable(this, {
      count: observable,
      setCount: action,
    })
  }
  count = ''

  setCount = () => {
    this.count = this.count + 1
  }

  
}
export const store = new Store()
// export const store = Store
