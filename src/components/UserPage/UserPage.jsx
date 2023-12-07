import React, { useContext, useEffect } from 'react'
import styles from './UserPage.module.scss'
import {Context} from '@/context.js'
import post_adding from './images/post_adding.svg'
import { useNavigate } from 'react-router';
import { Avatar } from '@mui/material'
import MyLoader from '@/components/UI/MyLoader/MyLoader.jsx';
import { CircularProgress, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, TextField } from '@mui/material';
import { useRef } from 'react';
import { rememberUser, jsonParseData } from '@/utils'
import { useState } from 'react';
import { WithCarpet } from '@/components/UI/WithCarpet/WithCarpet.jsx';

const UserPage = React.forwardRef((props, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let {userData, setUserData} = useContext(Context)
  let settingsRef = useRef()

  let addPost = async () => {
    let response = await fetch(`${apiUrl}user/${userData.name}/posts`, {
      method: 'POST',
    })
    let newPost = await response.json()
    userData.posts.push(newPost)
    setUserData(userData)
    navigateTo(`/posts/${newPost.id}`)
  }

  let dataListSubscribersRef = useRef()
  let dataListSubscriptionsRef = useRef()
  let showList = (type) => {
    // subscribers/subscriptions
    type == 'subscribers' ? dataListSubscribersRef.current.classList.add(styles.data__list_active)
    : dataListSubscriptionsRef.current.classList.add(styles.data__list_active)
  }

  // -----------------Components---------------------

  let [isSettingsOpen, setIsSettingsOpen] = useState(false)
  let UserSettings = React.forwardRef((props, ref) => {
    let [settingsAvatarUrl, setSettingsAvatarUrl] = useState()
    let [settingsNameError, setSettingsNameError] = useState(false)
    let [settingsPasswordError, setSettingsPasswordError] = useState(false)
    let [isSettingsLoading, setIsSettingsLoading] = useState(false)
    let fieldNameRef = useRef()
    let fieldPasswordRef = useRef()
    let avatarInputSettingsRef = useRef()

    useEffect(() => {
      console.log(isSettingsOpen)
    }, [])

    useEffect(() => {
      setSettingsAvatarUrl(apiUrl + userData.avatar)
    }, [userData])

    let quitAccount = async () => {
      document.cookie = 'name=0;max-age=0'
      document.cookie = 'password=0;max-age=0'
      location.reload()
    }

    let resetErrors = () => {
      setSettingsNameError(false)
      setSettingsPasswordError(false)
    }

    let validate = (maxLength = 6) => {
      let inputName = fieldNameRef.current.querySelector('input').value
      let inputPassword = fieldPasswordRef.current.querySelector('input').value
      inputName.length < maxLength ? setSettingsNameError(`Минимальное кол-во символов: ${maxLength}`) : false
      inputPassword.length < maxLength ? setSettingsPasswordError(`Минимальное кол-во символов: ${maxLength}`) : false
      if (inputName.length >= maxLength && inputPassword.length >= maxLength) {
        return true
      } else {
        return false
      }
    } 

    let updateData = async () => {
      let formData = new FormData()
      formData.append('name', fieldNameRef.current.querySelector('input').value)
      formData.append('password', fieldPasswordRef.current.querySelector('input').value)
      formData.append('avatar', avatarInputSettingsRef.current.files[0])
      let response = await fetch(`${apiUrl}user/${userData.name}`, {
        method: 'PUT',
        body: formData
      })
      if (response.ok) {
        response = await response.json()
        setIsSettingsOpen(true)
        setUserData(jsonParseData(response))
        rememberUser(document, response.name, response.password)
      } else {
        console.log('updateData error')
      }
    }

    // ------------
    return (
      <div ref={settingsRef} className={`${styles.settings} ${isSettingsOpen ? styles.settings_active : false}`}>
        {isSettingsLoading ? <CircularProgress className={styles.settings__loader}/> : <></>}
        <input ref={avatarInputSettingsRef} onChange={event => {
          setSettingsAvatarUrl(URL.createObjectURL(event.target.files[0]))
        }} hidden accept="image/*" type="file" id='settingsAvatar'/>
        <label htmlFor="settingsAvatar"><Avatar className={styles.settings__avatar} src={settingsAvatarUrl}/></label>
        <TextField ref={fieldNameRef} error={Boolean(settingsNameError)} helperText={settingsNameError} label='Имя' defaultValue={userData.name}></TextField>
        <TextField ref={fieldPasswordRef} error={Boolean(settingsPasswordError)} helperText={settingsPasswordError} label='Пароль' defaultValue={userData.password}></TextField>
        <Button onClick={async () => {
          setIsSettingsLoading(true)
          resetErrors()
          validate() ? await updateData() : false
          setIsSettingsLoading(false)
        }} className={styles.settings__saveButton} variant='contained'>сохранить</Button>
        <Button className={styles.settings__quitButton} onClick={quitAccount}>Выйти из аккаунта</Button>
      </div>
    )
  })


  // ------------------------------------------------
  return (
    <>
      {!userData ? <MyLoader/> :
        <div className={styles.userPage} {...props} ref={ref}>
          <WithCarpet activeClass={styles.settings_active}>
            <UserSettings ref={settingsRef}/>
          </WithCarpet>
          <header>
            <IconButton className={styles.settings__button} onClick={() => {
              settingsRef.current.classList.toggle(styles.settings_active)
            }}>
              <SettingsIcon/>
            </IconButton>
            <div>
              <h3 className={styles.name}>{userData.name}</h3>
              <Avatar className={styles.avatar} src={apiUrl + userData.avatar}/>
            </div>
          </header>
          <main>
            <div className={styles.data}>
              <p className={styles.data__block}>
                <strong>Посты</strong>
                <span>{userData.posts.length}</span>
              </p>
              <p className={styles.data__block} onClick={() => showList('subscribers')}>
                <strong>Подписчики</strong>
                <span>{userData.subscribers.length}</span>
              </p>
              <WithCarpet activeClass={styles.data__list_active}>
                <div ref={dataListSubscribersRef} className={styles.data__list}>
                  {userData.subscribers.map(subscriber =>
                    <div className={styles.data__listItem} key={subscriber}>
                      <a href={`${location.href}users/${subscriber}`}>{subscriber}</a>
                    </div>)
                  }
                </div>
              </WithCarpet>
              <p className={styles.data__block} onClick={() => showList('subscriptions')}>
                <strong>Подписки</strong>
                <span>{userData.subscriptions.length}</span>
              </p>
              <WithCarpet activeClass={styles.data__list_active}>
                <div ref={dataListSubscriptionsRef} className={styles.data__list}>
                  {userData.subscriptions.map(subscription =>
                    <div className={styles.data__listItem} key={subscription}>
                      <a href={`${location.href}users/${subscription}`}>{subscription}</a>
                    </div>)
                  }
                </div>
              </WithCarpet>
            </div>
            <div className={styles.posts}>
              {userData.posts.map(post => 
                <div className={styles.posts__post} onClick={() => {
                  navigateTo(`/posts/${post.id}`)
                }} key={post.id}>
                  {post.title}
                </div>)}
              <div className={`${styles.posts__post} ${styles.posts__adding}`} onClick={addPost}>
                <img src={post_adding} alt="+"/>
              </div>
            </div>
          </main>
        </div>
      }
    </>
  )
})

export default UserPage