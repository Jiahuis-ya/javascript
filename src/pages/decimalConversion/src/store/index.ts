import { action, observable, computed } from 'mobx'
import {
  makeObservable // fix: handle以后不刷新
} from 'mobx'
import { ConversionStatus } from '@/types/enum'
import {
  anyBaseToDecimal, // n转10进制
  decimalToAnyBase,
  checkValid
} from '@/utils'

type IStores = IStore

const options = [
  ConversionStatus.TWO,
  ConversionStatus.EIGHT,
  ConversionStatus.TEN,
  ConversionStatus.SIXTEEN
]

class Store<IStores> {
  constructor() {
    makeObservable(this, {
      selectValue: observable,
      baseOptions: observable,
      inputValue: observable,
      tableData: observable,
      setSelect: action,
      formatCount: action,
      setInputValue: action
    })
  }

  options = options
  baseOptions = options.map((item, index) => {
    return {
      key: `${index}`,
      value: item,
      checked: !true
    }
  })
  inputValue = ''
  selectValue = ConversionStatus.TWO
  tableData = options.map((item) => {
    return {
      key: item,
      value: ''
    }
  })
 
  formatCount() {
    if(!this.inputValue){
      return
    } else if(!checkValid(this.selectValue, this.inputValue)) {
      alert(`请输入${this.selectValue}进制数`);
      return;
    }
    
    this.tableData.forEach(item => {
      // n进制转key进制
      switch(this.selectValue) {
        case '2':
        case '8':
        case '16': 
          const value = anyBaseToDecimal(this.inputValue)(+this.selectValue) + ''; //n转10, 再10转n
          
          if(item.key === ConversionStatus.TEN) {
            item.value = value;
          } else {
            item.value = decimalToAnyBase(value, +item.key);
          }
        break;
        case '10': // 10进制转n进制
        console.log(10)
          item.value = decimalToAnyBase(this.inputValue, +item.key);
        break;
        default: 
          item.value = '';
      }

      if(this.selectValue === item.key) {
        item.value = +this.inputValue + '';
      }
      
    });
  };

  setSelect = (value: IConversionStatus) => {
    this.selectValue = value
  }

  setInputValue = (value: string) => {
    this.inputValue = value
  }

  
}
export const store = new Store()
// export const store = Store
