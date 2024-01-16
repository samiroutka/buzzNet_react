import React from 'react'
import styles from './Subs.module.scss'
import { useEffect } from 'react'
import { Avatar } from '@mui/material';

export const Subs = React.forwardRef(({userData, type, activeClassCallback}, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL

  useEffect(() => {
    activeClassCallback(styles.data__list_active)
  }, [])
  return (
    <div ref={ref} className={styles.data__list}>
      {type == 'subscribers' ? 
      userData.subscribers.map(subscriber =>
        <a className={styles.data__list_user} href={`${location.origin}/users/${subscriber.name}/`} key={subscriber.name}>
          <Avatar className={styles.data__list_avatar} src={apiUrl + subscriber.avatar}/>
          <span>{subscriber.name}</span>
        </a>)
      : userData.subscriptions.map(subscription =>
        <a className={styles.data__list_user} href={`${location.origin}/users/${subscription.name}/`} key={subscription.name}>
          <Avatar className={styles.data__list_avatar} src={apiUrl + subscription.avatar}/>
          <span>{subscription.name}</span>
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
