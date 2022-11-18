import React, { FC, useState, useCallback } from 'react'
import classnames from 'classnames/bind'
import styles from './index.module.less';
const cs = classnames.bind(styles)
interface IProps {

}

const Index: React.FC<IProps> = () => {

  return (
    <section className={ cs('operate') }>
      <input type="text" className={ cs('text') } />
      <button className={ cs('btn') }>转换</button>
    </section>
  )
}

export default Index