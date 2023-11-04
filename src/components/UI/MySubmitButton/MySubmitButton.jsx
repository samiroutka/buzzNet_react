import React from 'react'
import styles from './MySubmitButton.module.scss'

const MySubmitButton = (props) => {
  return (
    <input {...props} className={styles.Submit} type="submit"/>
  )
}

export default MySubmitButton