import React from 'react'
import styles from './Line.module.scss'

const Line = React.forwardRef((props, ref) => {
  return (
    <div {...props} ref={ref}>
      Line
    </div>
  )
})

export default Line