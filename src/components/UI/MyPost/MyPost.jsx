import React, { useContext, useEffect, useRef } from 'react'
import {Context} from '@/context.js'
import { useNavigate } from 'react-router';
import styles from './MyPost.module.scss'
import {Card, CardContent, CardMedia, CardActionArea} from '@mui/material'
import no_image from './no_image.svg';
import post_adding from './post_adding.svg'
import { Avatar } from '@mui/material'

export const MyPost = ({post, onClick, user}) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let userScoreRef = useRef()

  let addColorToScore = () => {
    let userScore = Number(userScoreRef.current.textContent)
    if (userScore > 0) {
      userScoreRef.current.classList.add(styles.posts__user_score_plus)
    } else if (userScore < 0) {
      userScoreRef.current.classList.add(styles.posts__user_score_minus)
    }
  }

  useEffect(() => {
    addColorToScore()
  }, [])

  return (
    <Card className={styles.posts__post} key={post.id} onClick={onClick}>
      <CardActionArea className={styles.posts__actionArea}>
        <CardMedia
          component="img"
          image={post.preview ? post.preview : no_image}
          alt="preview"
        />
        <CardContent>
          <p>{post.title}</p>
          {user ? 
            <div className={styles.posts__user}>
              <Avatar className={styles.posts__avatar} src={`${apiUrl}${post.user.avatar}`}/>
              <span>{post.user.name}</span>
            </div> : null
          }
          <strong ref={userScoreRef} className={styles.posts__user_score}>{post.tops.length - post.bottoms.length}</strong>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export const MyPostAdding = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {userData, setUserData} = useContext(Context)
  let navigateTo = useNavigate()

  let addPost = async () => {
    let response = await fetch(`${apiUrl}user/${userData.name}/posts`, {
      method: 'POST',
    })
    let newPost = await response.json()
    userData.posts.push(newPost)
    setUserData(userData)
    navigateTo(`/posts/${newPost.id}`)
  }

  return (
    <div className={`${styles.posts__post} ${styles.posts__adding}`} onClick={addPost}>
      <img src={post_adding} alt="+"/>
    </div>
  )
}

