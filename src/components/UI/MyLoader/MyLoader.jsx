import React from 'react'
import styles from './MyLoader.module.scss'

const MyLoader = () => {
  return (
    <div className={styles.Loader__wrapper}>
      <div className={styles.Loader}></div>
    </div>
  )
}

export default MyLoader