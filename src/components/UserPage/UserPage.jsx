import React, { useContext, useEffect } from 'react'
import styles from './UserPage.module.scss'
import {Context} from '../../context.js'
import post_adding from './images/post_adding.svg'
import { useNavigate } from 'react-router';
import { Avatar } from '@mui/material'

const UserPage = React.forwardRef((props, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let {userData, setUserData} = useContext(Context)

  let addPost = async () => {
    let response = await fetch(`${apiUrl}users/${userData.name}/posts`, {
      method: 'POST',
    })
    let newPost = await response.json()
    userData.posts.push(newPost)
    setUserData(userData)
    navigateTo(`/${newPost.id}`)
  }

  // --------------------
  return (
    <div className={styles.usePage} {...props} ref={ref}>
      <header>
        <h3 className={styles.name}>{userData.name}</h3>
        <Avatar className={styles.avatar} src={apiUrl + userData.avatar}/>
      </header>
      <main>
        <div className={styles.data}>
          <p className={styles.data__block}>
            <strong>Посты</strong>
            <span>{!userData.posts ? 0 : userData.posts.length}</span>
          </p>
          <p className={styles.data__block}>
            <strong>Подписчики</strong>
            <span>{!userData.subscribers ? 0 : userData.subscribers}</span>
          </p>
          <p className={styles.data__block}>
            <strong>Подписки</strong>
            <span>{!userData.subscriptions ? 0 : userData.subscriptions}</span>
          </p>
        </div>
        <div className={styles.posts}>
          {userData.posts.map(post => 
            <div className={styles.posts__post} onClick={() => {
              navigateTo(`/${post.id}`)
            }} key={post.id}>
              {post.title}
            </div>)}
          <div className={`${styles.posts__post} ${styles.posts__adding}`} onClick={addPost}>
            <img src={post_adding} alt="+"/>
          </div>
        </div>
      </main>
    </div>
  )
})

export default UserPage