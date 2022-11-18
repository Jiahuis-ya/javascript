import React, { FC, useState } from 'react'
import classnames from 'classnames/bind'
import styles from './index.module.less';
const cs = classnames.bind(styles)
import { action, observable, computed, autorun } from 'mobx'
import { Observer, useLocalObservable } from 'mobx-react'
import { store } from '@/store'
interface IProps {

}

const Index: React.FC<IProps> = () => {
  // const localStore: IStore = useLocalObservable(() => store)
  const [data, setData] = useState([
    {
      name: '2',
      value: ''
    },
    {
      name: '8',
      value: ''
    },
    {
      name: '10',
      value: ''
    },
    {
      name: '16',
      value: ''
    }
  ])

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
                data.map((i, idx) => {
                  return (
                    <tr className="tpl" key={ idx }>
                      <td>{ i?.name }</td>
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