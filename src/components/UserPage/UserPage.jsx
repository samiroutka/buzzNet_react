import React, { useContext, useEffect } from 'react'
import styles from './UserPage.module.scss'
import {Context} from '../../context.js'
import post_adding from './images/post_adding.svg'
import { useNavigate } from 'react-router';
import { Avatar } from '@mui/material'
import MyLoader from '../UI/MyLoader/MyLoader.jsx';
import { CircularProgress, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, TextField } from '@mui/material';
import { useRef } from 'react';
import { useState } from 'react';

const UserPage = React.forwardRef((props, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let {userData, setUserData} = useContext(Context)
  let settingsRef = useRef()
  let carpetRef = useRef()
  let fieldNameRef = useRef()
  let fieldPasswordRef = useRef()
  let avatarInputSettingsRef = useRef()
  let [isSettingsLoading, setIsSettingsLoading] = useState(false)
  let [settingsNameError, setSettingsNameError] = useState(false)
  let [settingsPasswordError, setSettingsPasswordError] = useState(false)

  let updateData = async () => {
    let formData = new FormData()
    formData.append('name', fieldNameRef.current.querySelector('input').value)
    formData.append('password', fieldPasswordRef.current.querySelector('input').value)
    formData.append('avatar', avatarInputSettingsRef.current.files[0])
    let response = await fetch(`${apiUrl}user/${userData.name}`, {
      method: 'PUT',
      body: formData
    })
    response = await response.json()
    if (response.name == fieldNameRef.current.querySelector('input').value) {
      response.posts = JSON.parse(response.posts)
      setUserData(response)
    } else {
      console.log(response)
    }
  }

  let quitAccount = async () => {
    document.cookie = 'name=0;max-age=0'
    document.cookie = 'password=0;max-age=0'
    location.reload()
  }

  let addPost = async () => {
    let response = await fetch(`${apiUrl}user/${userData.name}/posts`, {
      method: 'POST',
    })
    let newPost = await response.json()
    userData.posts.push(newPost)
    setUserData(userData)
    navigateTo(`/posts/${newPost.id}`)
  }

  // --------------------
  return (
    <>
      {!userData ? <MyLoader/> :
        <div className={styles.usePage} {...props} ref={ref}>
          <div ref={settingsRef} className={styles.settings}>
            {isSettingsLoading ? <CircularProgress className={styles.settings__loader}/> : <></>}
            <input ref={avatarInputSettingsRef} hidden accept="image/*" type="file" id='settingAvatar'/>
            <label htmlFor="settingAvatar"><Avatar className={styles.settings__avatar} src={apiUrl + userData.avatar}/></label>
            <TextField ref={fieldNameRef} error={Boolean(settingsNameError)} helperText={settingsNameError} label='Имя' defaultValue={userData.name}/>
            <TextField ref={fieldPasswordRef} error={Boolean(settingsPasswordError)} helperText={settingsPasswordError} label='Пароль' defaultValue={userData.password}/>
            <Button onClick={async () => {
              let inputNameLength = fieldNameRef.current.querySelector('input').value.length
              let inputPasswordLength = fieldPasswordRef.current.querySelector('input').value.length
              setIsSettingsLoading(true)
              if (inputNameLength < 6) {
                setSettingsNameError('Недостоточно символов (<6)')
              }
              if (inputPasswordLength < 6) {
                setSettingsPasswordError('Недостоточно символов (<6)')
              }
              if (inputNameLength >= 6 && inputPasswordLength >= 6){
                setSettingsNameError(false)
                setSettingsPasswordError(false)
                await updateData()
              }
              setIsSettingsLoading(false)
            }} className={styles.settings__saveButton} variant='contained'>сохранить</Button>
            <Button className={styles.settings__quitButton} onClick={quitAccount}>Выйти из аккаунта</Button>
          </div>
          <div ref={carpetRef} className={styles.carpet}></div>
          <header>
            <IconButton className={styles.settings__button} onClick={() => {
              settingsRef.current.classList.add(styles.opened)
              carpetRef.current.classList.add(styles.active)
              carpetRef.current.addEventListener('click', () => {
                settingsRef.current.classList.remove(styles.opened)
                carpetRef.current.classList.remove(styles.active)
              })
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
                <span>{!userData.posts ? 0 : userData.posts.length}</span>
              </p>
              <p className={styles.data__block}>
                <strong>Подписчики</strong>
                <span>{!userData.subscribers ? 0 : userData.subscribers}</span>
              </p>
              <p className={styles.data__block}>
                <strong>Подписки</strong>
                <span>{!userData.subscriptions ? 0 : userData.subscriptions}</span>
              </p>
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