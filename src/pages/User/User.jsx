import React, { useContext, useEffect, useState } from 'react'
import styles from './User.module.scss'
import { useParams, useLocation } from 'react-router';
import { Avatar, Button } from '@mui/material'
import { useNavigate } from 'react-router'
import { Context } from '@/context';
import { jsonParseData } from '@/utils.js';
import MyLoader from '@/components/UI/MyLoader/MyLoader';

const User = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {state} = useLocation()
  let {user} = useParams()
  let {userData, setUserData} = useContext(Context)
  let navigateTo = useNavigate()
  let [isLoading, setIsLoading] = useState(state ? false : true)
  let [foundUserData, setFoundUserData] = useState(state ? state : false)
  let [subscription, setSubscription] = useState(false)

  let getUser = async () => {
    let response = await fetch(`${apiUrl}user/${user}`)
    response = await response.json()
    if (response != 'Wrong user'){
      response = jsonParseData(response)
      setFoundUserData(response)
      setIsLoading(false)
    } else {
      navigateTo(`/error${window.location.pathname}`)
    }
  }

  let changeSubscription = async (type) => {
    // subscription/unsubscription
    let formData = new FormData()
    if (type == 'unsubscription') {
      userData.subscriptions.splice(userData.subscriptions.indexOf(foundUserData.name), 1)
      formData.append('subscriptions', JSON.stringify(userData.subscriptions))
    } else if (type == 'subscription'){
      formData.append('subscriptions', JSON.stringify([...userData.subscriptions, foundUserData.name]))
    }
    let response = await fetch(`${apiUrl}user/${userData.name}`, {
      method: 'put',
      body: formData
    })
    response = await response.json()
    response = jsonParseData(response)
    setUserData(response)

    let formData2 = new FormData()
    if (type == 'unsubscription') {
      foundUserData.subscribers.splice(foundUserData.subscribers.indexOf(userData.name), 1)
    } else if (type == 'subscription'){
      foundUserData.subscribers = [...userData.subscriptions, foundUserData.name]
    }
    setFoundUserData(foundUserData)
    formData2.append('subscriptions', JSON.stringify(foundUserData.subscribers))
    await fetch(`${apiUrl}user/${user}`, {
      method: 'put',
      body: formData2
    })
  }

  useEffect(() => {
    !foundUserData ? getUser() : false
  }, [])

  useEffect(() => {
    if (foundUserData && userData) {
      userData.subscriptions.includes(foundUserData.name) ? setSubscription(true) : setSubscription(false)
    }
  }, [foundUserData, userData])

  // --------------------
  return (
    <>
      {isLoading ? <MyLoader/> : 
        <div className={styles.User}>
          <div className={styles.User__header}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Avatar className={styles.User__avatar} src={apiUrl+foundUserData.avatar}/>
              <h2>{foundUserData.name}</h2>
            </div>
            {subscription ? 
            <Button onClick={() => {changeSubscription('unsubscription')}} variant='outlined'>Отписаться</Button> :
            <Button onClick={() => {changeSubscription('subscription')}} variant='contained'>Подписаться</Button>}
          </div>
          <div className={styles.User__data}>
            <p>
              <strong>Постов</strong>
              <span>{foundUserData.posts.length}</span>
            </p>
            <p>
              <strong>Подписчиков</strong>
              <span>{foundUserData.subscribers.length}</span>
            </p>
            <p>
              <strong>Подписок</strong>
              <span>{foundUserData.subscriptions.length}</span>
            </p>
          </div>
          <div className={styles.User__posts}>
            {foundUserData.posts.map(post => 
            <div className={styles.User__post} key={post.id} onClick={() => {
              navigateTo(`/users/${foundUserData.name}/posts/${post.id}`, {state: post})
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
