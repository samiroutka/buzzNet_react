import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './Login.module.scss'
import MyField from '../../components/UI/MyField/MyField'
import MySubmitButton from './../../components/UI/MySubmitButton/MySubmitButton'
import { Context } from '../../context'
import MyLoader from './../../components/UI/MyLoader/MyLoader';
import { getCookie, rememberUser } from '../../utils'

const Login = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {setIsLoading, isLoading, setIsLogin, setUserData} = useContext(Context)

  let field1 = useRef()
  let field2 = useRef()
  let checkBox = useRef()
  let [field1_error, setField1_error] = useState('')
  let [field2_error, setField2_error] = useState('')

  let clearErrors = () => {
    setField1_error('')
    setField2_error('')
  }

  let checkAccount = async (form) => {
    clearErrors()
    let formData = new FormData()
    formData.append('name', field1.current.value)
    formData.append('password', field2.current.value)
    let response = await fetch(`${apiUrl}login/`, {
      method: 'POST',
      body: formData,
    })
    response = await response.json()
    response.posts = JSON.parse(response.posts)
    if (response.name == field1.current.value){
      if (checkBox.current.checked) {
        rememberUser(document, field1.current.value, field2.current.value)
      }
      setUserData(response)
      setIsLogin(true)
    } else if (response == 'NAME') {
      setField1_error('Аккаунта с таким именем не найдено')
      return 'NAME'
    } else if (response == 'PASSWORD') {
      setField2_error('Пароль неверный')
      return 'PASSWORD'
    }
  }

  // ---------------------
  return (
    <div className={styles.Register}>
      {isLoading ? <MyLoader/> : <></>}
      <h1 className='title'>Войти в BuzzNet</h1>
      <form action="" onSubmit={async event => {
        event.preventDefault()
        setIsLoading(true)
        await checkAccount()
        setIsLoading(false)
      }}>
        <MyField error_text={field1_error} ref={field1} label='Имя' maxLength={30} minLength={6}/>
        <MyField error_text={field2_error} ref={field2} label='Пароль' maxLength={30} minLength={6}/>
        <div className={styles.remember}>
          <label htmlFor="checkbox">Запомнить меня</label>
          <input ref={checkBox} type="checkbox" id="checkbox"/>
        </div>
        <MySubmitButton value='Продолжить'/>
      </form>
      <p className={styles.redirection}>Нет аккаунта? <a href='register'>Зарегистрироваться</a></p>
    </div>
  )
}

export default Login