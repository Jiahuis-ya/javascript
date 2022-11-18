import React, { FC, ReactNode, useState} from 'react'
import classnames from 'classnames/bind'
import styles from './index.module.less';
const cs = classnames.bind(styles)

interface CheckBoxProps {
  checked: boolean
  value: IConversionStatus
  onChange?: (value: IConversionStatus) => void
}
const CheckBox = (props: CheckBoxProps) => {
  const {
    checked = false,
    value,
    onChange= () => {}
  } = props

  return (
    <div
      onClick={() => onChange(value)}
      className={ cs('checkItem') }
    >
      <input
        type="checkbox"
        checked={ checked }
        onChange={() => {}}
      />
      <span>{value}进制</span>
    </div>
  )
}

export default CheckBox