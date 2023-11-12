import React, { useEffect, useState } from 'react'
import styles from './User.module.scss'
import { useParams, useLocation } from 'react-router';
import { Avatar } from '@mui/material'
import { useNavigate } from 'react-router'
import MyLoader from '../../components/UI/MyLoader/MyLoader';

const User = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {state} = useLocation()
  let {user} = useParams()
  let navigateTo = useNavigate()
  let [isLoading, setIsLoading] = useState(state ? false : true)
  let [userData, setUserData] = useState()

  let getUser = async () => {
    let response = await fetch(`${apiUrl}user/${user}`)
    response = await response.json()
    if (response != 'Wrong user'){
      setUserData(response)
      setIsLoading(false)
    } else {
      navigateTo(`/error${window.location.pathname}`)
    }
  }

  useEffect(() => {
    !state ? getUser() : false
  }, [])

  // --------------------
  return (
    <>
      {isLoading ? <MyLoader/> : 
        <div className={styles.User}>
          <div className={styles.User__header}>
            <Avatar className={styles.User__avatar} src={state ? apiUrl+state.avatar : apiUrl+userData.avatar}/>
            <h2>{state ? state.name : userData.name}</h2>
          </div>
          <div className={styles.User__about}>

          </div>
          <div className={styles.User__posts}>
            {JSON.parse(state ? state.posts : userData.posts).map(post => 
            <div className={styles.User__post} key={post.id} onClick={() => {
              navigateTo(`/users/${state ? state.name : userData.name}/posts/${post.id}`, {state: post})
            }}>
              {post.title}
            </div>)}
          </div>
        </div>
      }
    </>
  )
}

export default User
