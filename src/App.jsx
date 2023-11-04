import React, { useEffect, useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useNavigate } from 'react-router'
import './App.scss'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Main from './pages/Main/Main'
import Error from './pages/Error/Error'
import Post from './pages/Post/Post'
import {Context} from './context.js' 
import {getCookie} from './utils.js'
import { StyledEngineProvider } from '@mui/material/styles';

const App = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let [isLogin, setIsLogin] = useState(false)
  let [isLoading, setIsLoading] = useState(false)
  let [userData, setUserData] = useState(false)

  let checkData = async () => {
    console.log('checking...')
    let formData = new FormData()
    formData.append('name', getCookie(document, 'name'))
    formData.append('password', getCookie(document, 'password'))
    let response = await fetch(`${apiUrl}login/`, {
      method: 'POST',
      body: formData,
    })
    response = await response.json()
    if (response.name == getCookie(document, 'name')) {
      setIsLogin(true)
      setUserData(response)
    }
  }

  useEffect(() => {
    if (getCookie(document, 'name') && getCookie(document, 'password')) {
      setIsLoading(true)
      checkData()
      setIsLoading(false)
    }
  }, [])

  // --------------------
  return (
    <StyledEngineProvider injectFirst>
    <Context.Provider value={{apiUrl, isLogin, setIsLogin,
     isLoading, setIsLoading, userData, setUserData}}>
      <BrowserRouter>
        {isLogin?
        <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/:postId" element={<Post/>}/>
          <Route path='/error' element={<Error/>}/>
          <Route path='*' element={<Error/>}/>
        </Routes>:
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path='*' element={<Error/>}/>
        </Routes>}
      </BrowserRouter>
    </Context.Provider>
    </StyledEngineProvider>
  )
}

export default App