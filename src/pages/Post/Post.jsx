import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import styles from './Post.module.scss'
import { Context } from '../../context'
import { TextField, Button } from '@mui/material'
import MyLoader from '../../components/UI/MyLoader/MyLoader'

const Post = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {userData, setUserData} = useContext(Context)
  let {postId} = useParams()
  let posts = JSON.parse(userData.posts)
  let titleElement = useRef()
  let [isLoading, setIsLoading] = useState(false)

  let saveData = async () => {
    let formData = new FormData()
    formData.append('title', titleElement.current.querySelector('input').value)
    formData.append('content', '')
    let response = await fetch(`${apiUrl}users/${userData.name}/posts/${postId}`, {
      method: 'PUT',
      body: formData
    })
    response = await response.json()
    if (response) {
      userData.posts = JSON.stringify(response)
      setUserData(userData)
    }
  }

  // ----------
  return (
    <div className={styles.post}>
      {isLoading ? <MyLoader/> : <></>}
      <TextField ref={titleElement} className={styles.title} defaultValue={posts.find(post => post.id == postId).title} id="standard-basic" label="Название поста" variant="standard"/>
      <Button className={styles.button} onClick={async () => {
        setIsLoading(true)
        await saveData()
        setIsLoading(false)
      }} variant="contained">Сохранить</Button>
    </div>
  )
}

export default Post