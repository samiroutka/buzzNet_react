import React, { useEffect, useRef } from 'react'
import styles from './Post.module.scss'
import { useParams, useLocation } from 'react-router';

const Post = () => {
  let {state} = useLocation()
  let contentRef = useRef()

  useEffect(() => {
    contentRef.current.innerHTML = state.content
  })

  // --------------------
  return (
    <div className={styles.Post}>
      <h1 className={styles.Post__title}>{state.title}</h1>
      <div ref={contentRef} className={styles.Post__content}></div>
    </div>
  )
}

export default Post
