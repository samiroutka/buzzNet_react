import React, { useEffect, useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router'
import MyField from '../../components/UI/MyField/MyField.jsx'
import styles from './Register.module.scss'
import MySubmitButton from './../../components/UI/MySubmitButton/MySubmitButton';
import MyLoader from './../../components/UI/MyLoader/MyLoader';
import { Context } from '../../context'
import { rememberUser } from '../../utils.js'

const Register = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {setIsLoading, isLoading, setIsLogin, setUserData} = useContext(Context)
  let navigateTo = useNavigate()
  let checkBox = useRef()

  let field1 = useRef()
  let field2 = useRef()

  let [errorText, setErrorText] = useState('')

  let registerUser = async () => {
    let formData = new FormData()
    formData.append('name', field1.current.value)
    formData.append('password', field2.current.value)
    let response = await fetch(`${apiUrl}register/`, {
      method: 'POST',
      body: formData,
    })
    response = await response.json()
    if (response.name == field1.current.value) {
      if (checkBox.current.checked) {
        rememberUser(document, field1.current.value, field2.current.value)
      }
      response.posts = JSON.parse(response.posts)
      setUserData(response)
      setIsLogin(true)
      navigateTo('/')
      return true
    } else if (response == 'NAME') {
      setErrorText('Имя уже существувет')
      return 'NAME'
    }
  }

  // --------------------
  return (
    <div className={styles.Register}>
      {isLoading?
      <MyLoader/>:<></>}
      <h1 className='title'>Зарегистрироваться в<br />BuzzNet</h1>
      <form action="" onSubmit={async event => {
        event.preventDefault()
        setIsLoading(true)
        await registerUser()
        setIsLoading(false)
      }}>
        <MyField error_text={errorText} ref={field1} label='Имя' maxLength={30} minLength={6}/>
        <MyField ref={field2} label='Пароль' maxLength={30} minLength={6}/>
        <div className={styles.remember}>
          <label htmlFor="checkbox">Запомнить меня</label>
          <input ref={checkBox} type="checkbox" id="checkbox"/>
        </div>
        <MySubmitButton value='Продолжить'/>
      </form>
      <p className={styles.redirection}>Есть аккаунт? <a href='/'>Войти</a></p>
    </div>
  )
}

export default Register