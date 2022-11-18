import React, { FC, ReactNode, useState} from 'react'
import classnames from 'classnames/bind'
import styles from './index.module.less';
const cs = classnames.bind(styles)
import { useImmer } from 'use-immer'
import CheckBox from '../CheckBox'
interface IProps {

}


interface SelectProps {
  value: string
  onSelect?: (value: string) => void
}

const options = ['2','8','10','16'];
const checkOptions = options.map((item, index) => {
  return {
    key: `${index}`,
    value: item,
    checked: !true
  }
})

const Select = (props: SelectProps) => {
  const {
    value,
    onSelect = () => {}
  } = props
  

 
  return (
    <select
      value={ value }
      name="gender"
      onChange={ (e) => onSelect(e?.target?.value) }
    >
      {
        options.map((item, idx) => {
          return (
            <option value={item} key={idx}>{item}</option>
          )
        })
      }
      
    </select>
  )
}

const Index: React.FC<IProps> = () => {
  const[data, setData] = useImmer(checkOptions)
  const [current, setCurrent] = useState('2')
  

  return (
    <section className={ cs('operate') }>
      <div className={cs('checkWrap')}>
        {
          data.map((item, idx) => {
            return (
              <CheckBox
                key={idx}
                checked={item.value === current}
                value={item.value}
                onChange={(value) => setCurrent(value)}
              />
            )
          })
        }
      </div>
      <Select
        value={current}
        onSelect={(value) => {
          console.log(value)
          setCurrent(value)
        }}
      />
    </section>
  )
}

export default Index