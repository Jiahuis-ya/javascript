import React, { FC, useState, useCallback, useRef } from 'react'
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
          <section className={ cs('operate') }>
            <input
              type="text"
              className={ cs('text') }
              value={ localStore.inputValue }
              onChange={
                (e) => {
                  localStore.setInputValue(e.target.value)
                }
              }
            />
            <button
              className={ cs('btn') }
              onClick={ (e) => {
                localStore.formatCount()
              } }
            >
              转换
            </button>
          </section>
        )
      }
    </Observer>
    
  )
}

export default Index