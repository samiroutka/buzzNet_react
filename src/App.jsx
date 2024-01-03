import React, { useEffect, useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { useNavigate } from 'react-router'
import './App.scss'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Main from './pages/Main/Main'
import Error from './pages/Error/Error'
import UserPagePost from './pages/UserPagePost/UserPagePost'
import User from './pages/User/User'
import Post from './pages/Post/Post.jsx'
import {Context} from './context.js' 
import { getCookie, jsonParseData } from './utils.js'
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
      setUserData(jsonParseData(response))
    }
  }

  useEffect(() => {
    if (getCookie(document, 'name') && getCookie(document, 'password')) {
      setIsLoading(true)
      setIsLogin(true)
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
          <Route path="/line" element={<Main/>}/>
          <Route path="/search" element={<Main/>}/>
          <Route path="/users/:user" element={<User/>}/>
          <Route path="/users/:user/posts/:id" element={<Post/>}/>
          <Route path="/posts/:postId" element={<UserPagePost/>}/>
          <Route path='/error' element={<Error/>}/>
          <Route path='/error/:wrongPath' element={<Error/>}/>
          <Route path='*' element={<Error/>}/>
        </Routes>:
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path='/error' element={<Error/>}/>
          <Route path='/error/:wrongPath' element={<Error/>}/>
          <Route path='*' element={<Error/>}/>
        </Routes>}
      </BrowserRouter>
    </Context.Provider>
    </StyledEngineProvider>
  )
}

export default App