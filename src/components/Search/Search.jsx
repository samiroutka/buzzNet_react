import React from 'react'
import styles from './Search.module.scss'

const Search = React.forwardRef((props, ref) => {
  return (
    <div {...props} ref={ref}>
      Поиск
    </div>
  )
})

export default Search