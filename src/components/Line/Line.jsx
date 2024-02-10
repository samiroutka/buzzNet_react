import React, { useContext, useEffect, useState } from 'react'
import {Context} from '@/context.js'
import styles from './Line.module.scss'
import { useNavigate } from 'react-router'
import MyLoader from '@/components/UI/MyLoader/MyLoader.jsx';
import {MyPost} from '@/components/UI/MyPost/MyPost.jsx'

const Line = React.forwardRef((props, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let {userData} = useContext(Context)
  let [posts, setPosts] = useState(false)

  let getPosts = async () => {
    let response = await fetch(`${apiUrl}user/${userData.name}/line/`)
    response = await response.json()
    setPosts(response)
    console.log(response)
  }  

  useEffect(() => {
    userData ? getPosts() : null
  }, [userData])

  return (
    <div {...props} ref={ref} className={styles.posts}>
      {!posts ? <MyLoader/> :
        posts.length > 0 ? posts.map(post => 
          <div className={styles.posts__post}>
            <MyPost user={true} post={post} onClick={() => {navigateTo(`/users/${post.user.name}/posts/${post.id}`)}}/>
          </div>
        ) : <p>Новых постов не найдено :(</p>
      }
    </div>
  )
})

export default Line