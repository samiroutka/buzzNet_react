import React, { useContext, useEffect } from 'react'
import styles from './UserPage.module.scss'
import {Context} from '@/context.js'
import { useNavigate } from 'react-router';
import MyLoader from '@/components/UI/MyLoader/MyLoader.jsx';
import { CircularProgress, IconButton, Avatar, Button, TextField, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRef } from 'react';
import { rememberUser, jsonParseData } from '@/utils'
import { useState } from 'react';
import { WithCarpet } from '@/components/UI/WithCarpet/WithCarpet.jsx';
import {Subs} from '@/components/Subs/Subs'
import {MyPost, MyPostAdding} from '../UI/MyPost/MyPost';

const UserPage = React.forwardRef((props, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let {userData, setUserData} = useContext(Context)
  let settingsRef = useRef()

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

  // -----------------Component---------------------

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
      <div ref={ref} className={`${styles.settings} ${isSettingsOpen ? styles.settings_active : false}`}>
        {isSettingsLoading ? <CircularProgress className={styles.settings__loader}/> : <></>}
        <input ref={avatarInputSettingsRef} onChange={event => {
          setSettingsAvatarUrl(URL.createObjectURL(event.target.files[0]))
        }} hidden accept="image/*" type="file" id='settingsAvatar'/>
        <label htmlFor="settingsAvatar" className={styles.settings__avatar_label}><Avatar className={styles.settings__avatar} src={settingsAvatarUrl}/></label>
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
              <WithCarpet activeClass={dataListsActiveClass}>
                <Subs ref={dataListSubscribersRef} activeClassCallback={getActiveClass} type='subscribers' userData={userData} />
              </WithCarpet>
              <p className={styles.data__block} onClick={() => showList('subscriptions')}>
                <strong>Подписки</strong>
                <span>{userData.subscriptions.length}</span>
              </p>
              <WithCarpet activeClass={dataListsActiveClass}>
                <Subs ref={dataListSubscriptionsRef} activeClassCallback={getActiveClass} type='subscriptions' userData={userData} />
              </WithCarpet>
            </div>
            <div className={styles.posts}>
              {userData.posts.map(post => 
                <MyPost post={post} onClick={() => {navigateTo(`/posts/${post.id}`)}}/>
              )}
              <MyPostAdding/>
            </div>
          </main>
        </div>
      }
    </>
  )
})

export default UserPage