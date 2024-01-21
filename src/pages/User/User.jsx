import React, { useContext, useEffect, useState, useRef } from 'react'
import styles from './User.module.scss'
import { useParams, useLocation } from 'react-router';
import { Avatar, Button } from '@mui/material'
import { useNavigate } from 'react-router'
import { Context } from '@/context';
import { jsonParseData } from '@/utils.js';
import MyLoader from '@/components/UI/MyLoader/MyLoader';
import MyLoaderMini from '@/components/UI/MyLoaderMini/MyLoaderMini';
import { WithCarpet } from '@/components/UI/WithCarpet/WithCarpet.jsx';
import { Subs } from '@/components/Subs/Subs';
import { MyPost } from '@/components/UI/MyPost/MyPost.jsx';

const User = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {user} = useParams()
  let {userData, setUserData} = useContext(Context)
  let navigateTo = useNavigate()
  let [isMainLoading, setMainIsLoading] = useState(true)
  let [isLoading, setIsLoading] = useState(false)
  let [foundUserData, setFoundUserData] = useState(false)
  let [subscription, setSubscription] = useState(false)

  let getUser = async () => {
    console.log('getUser')
    let response = await fetch(`${apiUrl}user/${user}`)
    response = await response.json()
    if (response != 'Wrong user'){
      response = jsonParseData(response)
      setFoundUserData(response)
      setMainIsLoading(false)
    } else {
      navigateTo(`/error${window.location.pathname}`)
    }
  }

  let changeSubscription = async (type) => {
    setIsLoading(true)
    let formData = new FormData()
    if (type == 'unsubscription') {
      for (let user of userData.subscriptions) {
        user.name == foundUserData.name ? userData.subscriptions.splice(userData.subscriptions.indexOf(user.name), 1) : null
      }
    } else if (type == 'subscription') {
      userData.subscriptions = [...userData.subscriptions, {name: foundUserData.name, avatar: foundUserData.avatar}]
    }
    formData.append('subscriptions', JSON.stringify(userData.subscriptions))
    let response = await fetch(`${apiUrl}user/${userData.name}`, {
      method: 'put',
      body: formData
    })
    response = await response.json()
    response = jsonParseData(response)
    setUserData(response)

    let formData2 = new FormData()
    if (type == 'unsubscription') {
      for (let user of foundUserData.subscribers) {
        user.name == userData.name ? foundUserData.subscribers.splice(foundUserData.subscribers.indexOf(user.name), 1) : null
      }
    } else if (type == 'subscription'){
      foundUserData.subscribers = [...foundUserData.subscribers, {name: userData.name, avatar: userData.avatar}]
    }
    formData2.append('subscribers', JSON.stringify(foundUserData.subscribers))
    await fetch(`${apiUrl}user/${user}`, {
      method: 'put',
      body: formData2
    })
    setFoundUserData(foundUserData)
    setIsLoading(false)
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    user == userData.name ? navigateTo('/') : null
  }, [userData])
  
  useEffect(() => {
    if (foundUserData && userData) {
      let isIncluded = false
      for (let user of userData.subscriptions) {
        user.name.includes(foundUserData.name) ? isIncluded = true : null
      }
      // isIncluded ? setSubscription(true) : setSubscription(false)
      isIncluded ? setSubscription(true) : setSubscription(false)
    }
  }, [foundUserData, userData])


  let [dataListsActiveClass, setDataListsActiveClass] = useState(false)
  let getActiveClass = (activeClass) => {
    setDataListsActiveClass(activeClass)
  }
  let dataListSubscribersRef = useRef()
  let dataListSubscriptionsRef = useRef()
  let showList = (type) => {
    // subscribers/subscriptions
    type == 'subscribers' ? dataListSubscribersRef.current.classList.add(dataListsActiveClass)
    : dataListSubscriptionsRef.current.classList.add(dataListsActiveClass)
  }

  // --------------------
  return (
    <>
      {isMainLoading ? <MyLoader/> : 
        <div className={styles.User}>
          {isLoading ? <MyLoaderMini/> : null}
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
            <p onClick={() => {showList('subscribers')}}>
              <strong>Подписчиков</strong>
              <span>{foundUserData.subscribers.length}</span>
            </p>
            <WithCarpet activeClass={dataListsActiveClass}>
              <Subs ref={dataListSubscribersRef} type='subscribers' userData={foundUserData} activeClassCallback={getActiveClass}/>
            </WithCarpet>
            <p onClick={() => {showList('subscriptions')}}>
              <strong>Подписок</strong>
              <span>{foundUserData.subscriptions.length}</span>
            </p>
            <WithCarpet activeClass={dataListsActiveClass}>
              <Subs ref={dataListSubscriptionsRef} type='subscriptions' userData={foundUserData} activeClassCallback={getActiveClass}/>
            </WithCarpet>
          </div>
          <div className={styles.User__posts}>
            {foundUserData.posts.length > 0 ?
              foundUserData.posts.map(post => 
                <MyPost post={post} onClick={() => {navigateTo(`/users/${user}/posts/${post.id}`)}}/>
              )
            : <h2 style={{margin: '0 auto'}}>Постов нету (</h2>}
          </div>
        </div>
      }
    </>
  )
}

export default User
