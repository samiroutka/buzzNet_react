import React, { useEffect, useState, useRef } from 'react'
import styles from './Post.module.scss'
import { useParams, useLocation } from 'react-router';
import MyLoader from '@/components/UI/MyLoader/MyLoader';

const Post = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {state} = useLocation()
  let {user, id} = useParams()
  let [isLoading, setIsLoading] = useState(state ? false : true)
  let [postData, setPostData] = useState(state ? state : false)
  let contentRef = useRef()

  let getPost = async () => {
    setIsLoading(true)
    let response = await fetch(`${apiUrl}user/${user}/posts/${id}`)
    response = await response.json()
    console.log('response')
    console.log(response)
    if (response) {
      setPostData(response)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    !postData ? getPost() : false
  }, [])

  // --------------------
  return (
    <>
      {isLoading ? <MyLoader/> : false}
      <div className={styles.Post}>
        <h1 className={styles.Post__title}>{postData.title}</h1>
        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: postData ? postData.content : false  }} className={styles.Post__content}></div>
      </div>
    </>
  )
}

export default Post
