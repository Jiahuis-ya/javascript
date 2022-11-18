import React, { FC, ReactNode, useState} from 'react'
import classnames from 'classnames/bind'
import styles from './index.module.less';
const cs = classnames.bind(styles)
import { useImmer } from 'use-immer'
import CheckBox from '../CheckBox'

import { Observer, useLocalObservable } from 'mobx-react'
import { store } from '@/store'


interface IProps {

}

interface SelectProps {
  value: IConversionStatus
  onSelect?: (value: IConversionStatus) => void
  options: Array<IBase>
}

const Select = (props: SelectProps) => {
  const {
    value,
    options=[],
    onSelect = () => {}
  } = props
  

  return (
    <select
      value={ value }
      name="gender"
      onChange={ (e) => onSelect(e?.target?.value as IConversionStatus) }
    >
      {
        options.map((item, idx) => {
          return (
            <option value={item.value} key={idx}>{item.value}</option>
          )
        })
      }
      
    </select>
  )
}

const Index: React.FC<IProps> = () => {
  const localStore: IStore = useLocalObservable(() => store)
  const [current, setCurrent] = useState<IConversionStatus>(localStore.options[0])

  return (
    <Observer>
      {
        () => (
          <section className={ cs('operate') }>
            <div className={cs('checkWrap')}>
              {
                localStore.baseOptions.map((item, idx) => {
                  return (
                    <CheckBox
                      key={idx}
                      checked={item.value === current}
                      value={item.value}
                      onChange={(value) => {
                        setCurrent(value)
                        localStore.setSelect(value)
                      }}
                    />
                  )
                })
              }
            </div>
            <Select
              value={current}
              onSelect={(value) => {
                setCurrent(value)
                localStore.setSelect(value)
              }}
              options={localStore.baseOptions}
            />
          </section>
        )
      }
    </Observer>
    
  )
}

export default Index