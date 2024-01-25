import React, { useEffect, useState, useRef } from 'react'
import styles from './Post.module.scss'
import { useParams } from 'react-router';
import { useNavigate } from 'react-router'
import MyLoader from '@/components/UI/MyLoader/MyLoader';
import { Avatar } from '@mui/material';
import { MyTabs } from '@/components/MyTabs/MyTabs.jsx';

const Post = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {user, id} = useParams()
  let [isLoading, setIsLoading] = useState(true)
  let [postData, setPostData] = useState(false)
  let contentRef = useRef()
  let navigateTo = useNavigate()

  let getPost = async () => {
    setIsLoading(true)
    let response = await fetch(`${apiUrl}user/${user}/posts/${id}`)
    response = await response.json()
    if (response) {
      setPostData(response)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPost()
  }, [])

  // --------------------
  return (
    <>
      {isLoading ? <MyLoader/> : false}
      <div className={styles.Post__header_wrapper}>
        <div className={styles.Post__header}>
          <h1 className={styles.Post__title}>{postData.title}</h1>
          <Avatar src={`${apiUrl}${postData.avatar}`} onClick={() => {navigateTo(`/users/${user}/`)}}/>
        </div>
      </div>
      <div className={styles.Post}>
        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: postData ? postData.content : false  }} className={styles.Post__content}></div>
      </div>
      <MyTabs/>
    </>
  )
}

export default Post
