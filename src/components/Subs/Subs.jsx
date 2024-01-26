import React from 'react'
import styles from './Subs.module.scss'
import { useState, useEffect } from 'react'
import { Avatar } from '@mui/material';

export const Subs = React.forwardRef(({userData, type, activeClassCallback}, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let [avatars, setAvatars] = useState(false)

  let getAvatars = async () => {
    let response = await fetch(`${apiUrl}users/avatars/`, {
      method: 'post',
      body: JSON.stringify(userData.subscriptions)
    })
    setAvatars(await response.json())
  }

  useEffect(() => {
    activeClassCallback(styles.data__list_active)
    getAvatars()
  }, [])

  return (
    <div ref={ref} className={styles.data__list}>
      {type == 'subscribers' ? 
      userData.subscribers.map(subscriber =>
        <a className={styles.data__list_user} href={`${location.origin}/users/${subscriber}/`} key={subscriber}>
          <Avatar className={styles.data__list_avatar} src={`${apiUrl}${avatars[subscriber]}`}/>
          <span>{subscriber}</span>
        </a>)
      : userData.subscriptions.map(subscription =>
        <a className={styles.data__list_user} href={`${location.origin}/users/${subscription}/`} key={subscription}>
          <Avatar className={styles.data__list_avatar} src={`${apiUrl}${avatars[subscription]}`}/>
          <span>{subscription}</span>
        </a>)
      }
      {type == 'subscribers' && userData.subscribers.length == 0 ?
        <p>Подписчиков нету(</p> :
        type == 'subscriptions' && userData.subscriptions.length == 0 ? 
        <p>Подписок нету(</p> : null
      }
    </div>
  )
})
