import React from 'react'
import classnames from 'classnames/bind'
import styles from './index.module.less';
const cs = classnames.bind(styles)
import { Observer, useLocalObservable } from 'mobx-react'
import { store } from '@/store'
interface IProps {

}

const Index: React.FC<IProps> = () => {
  const localStore: IStore = useLocalObservable(() => store)

  return (
    <Observer>
      {
        () => (
          <table className={ cs('tbl') }  width="100%" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th>进制</th>
                <th>结果</th>
              </tr>
            </thead>  
            <tbody>
              {
                localStore.tableData.map((i, idx) => {
                  return (
                    <tr className="tpl" key={ idx }>
                      <td>{ i?.key }</td>
                      <td>
                        <input type="text" className={cs('text')} value={i?.value} onChange={() => {}} />
                      </td>
                    </tr>
                  )
                })
              }
              
            </tbody>
          
          </table>
        )
      }
    </Observer>
    
  )
}

export default Index