import React from 'react'
import styles from './MyLoaderMini.module.scss'
import {CircularProgress} from '@mui/material'

const MyLoaderMini = () => {
  return (
    <div className={styles.User__loader_wrapper}>
      <CircularProgress className={styles.User__loader}/>
    </div>
  )
}

export default MyLoaderMini