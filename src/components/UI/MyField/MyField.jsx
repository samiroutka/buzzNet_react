import React from 'react'
import styles from './MyField.module.scss'

const MyField = React.forwardRef((props, ref) => {
  let {label, error_text} = props

  return (
    <div className={styles.Field}>
      {label?
      <label htmlFor="name">{label}</label>
      :<></>}
      <input className={styles.Input} {...props} ref={ref} required type="text" id='name'/>
      {error_text?
      <span className={styles.Span}>{error_text}</span>:<></>
      }
    </div>
  )
})

export default MyField