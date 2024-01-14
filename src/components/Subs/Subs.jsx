import React from 'react'
import styles from './Subs.module.scss'
import { useEffect } from 'react'

export const Subs = React.forwardRef(({userData, type, activeClassCallback}, ref) => {
  useEffect(() => {
    activeClassCallback(styles.data__list_active)
  }, [])
  return (
    <div ref={ref} className={styles.data__list}>
      {type == 'subscribers' ? 
      userData.subscribers.map(subscriber =>
        <a href={`${location.origin}/users/${subscriber}/`} key={subscriber}>{subscriber}</a>)
      : userData.subscriptions.map(subscription =>
        <a href={`${location.origin}/users/${subscription}/`} key={subscription}>{subscription}</a>)
      }
      {type == 'subscribers' && userData.subscribers.length == 0 ?
        <p>Подписчиков нету(</p> :
        type == 'subscriptions' && userData.subscriptions.length == 0 ? 
        <p>Подписок нету(</p> : null
      }
    </div>
  )
})
