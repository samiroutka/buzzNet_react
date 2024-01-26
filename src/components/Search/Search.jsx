import React, { useEffect } from 'react'
import styles from './Search.module.scss'
import { TextField, CircularProgress, IconButton, Avatar} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router'
import { Tab, Tabs, TabsList, TabPanel } from '@mui/base';
import { jsonParseData } from '@/utils.js';
import { Context } from '@/context';
import {MyPost} from '@/components/UI/MyPost/MyPost.jsx'

const SearchHeader = ({searchFunction, placeholder}) => {
  let inputRef = useRef()

  // ---------------------
  return (
    <div className={styles.search__header}>
      <TextField ref={inputRef} className={styles.search__searchField} placeholder={placeholder}/>
      <IconButton onClick={async () => {
        if (inputRef.current.querySelector('input').value.length > 0 && inputRef.current.querySelector('input').value[0] != ' '){
          console.log('search...')
          await searchFunction(inputRef)
        }
        }} className={styles.search__searchButton}>
        <SearchIcon color='primary'/>
      </IconButton>
    </div>
  )
}

const SearchPost = React.forwardRef((props, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let [foundPosts, setFoundPosts] = useState(['Initial'])
  let [isLoading, setIsLoading] = useState(false)
  let navigateTo = useNavigate()

  let searchPost = async (inputRef) => {
    setIsLoading(true)
    let inputValue = inputRef.current.querySelector('input').value
    let response = await fetch(`${apiUrl}posts/${inputValue}?user=true`)
    response = await response.json()
    setFoundPosts(response)
    setIsLoading(false)
  } 

  // --------------------
  return (
    <div className={styles.searchPost} {...props} ref={ref}>
      <SearchHeader searchFunction={searchPost} placeholder='Название поста'/>
      {isLoading ? <CircularProgress className={styles.loader}/> :
      <div className={styles.searchPost__posts}>
        {foundPosts[0] == 'Initial' ? <></>:
        foundPosts.length == 0 ?
        <p>Постов нету</p> :
        foundPosts.map(post => 
          <MyPost user={true} post={post} onClick={() => {navigateTo(`/users/${post.user.name}/posts/${post.id}`)}}/>
        )}
      </div>}
    </div>
  )
})

const SearchUser = React.forwardRef((props, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let [foundUsers, setFoundUsers] = useState(['Initial'])
  let [isLoading, setIsLoading] = useState(false)
  let {userData} = useContext(Context)
  let navigateTo = useNavigate()

  let searchUser = async (inputRef) => {
    setIsLoading(true)
    let inputValue = inputRef.current.querySelector('input').value
    let response = await fetch(`${apiUrl}users/${inputValue}`)
    response = await response.json()
    for (let user of response) {
      user = jsonParseData(user)
    }
    for (let user of response) {
      user.name == userData.name ? response.splice(response.indexOf(user), 1) : false
    }
    setFoundUsers(response)
    setIsLoading(false)
  }

  // --------------------
  return (
    <div className={styles.searchUser} {...props} ref={ref}>
      <SearchHeader searchFunction={searchUser} placeholder='Имя пользователя'/>
      {isLoading ? <CircularProgress className={styles.loader}/> :
      <div className={styles.searchUser__users}>
        {foundUsers[0] == 'Initial' ? <></>:
        foundUsers.length == 0 ?
        <p>Страничек нету</p> :
        foundUsers.map(user => 
        <div className={styles.searchUser__user} key={user.name} onClick={() => {
          navigateTo(`/users/${user.name}/`)
        }}>
          <Avatar className={styles.searchUser__avatar} src={apiUrl + user.avatar}/>
          <p>{user.name}</p>
        </div>)
        }
      </div>}
    </div>
  )
})

// -----------------------------------------------------------

const Search = React.forwardRef((props, ref) => {
  // --------------------
  return (
    <Tabs defaultValue='SearchPost'>
      <TabsList className={styles.search__tabList}>
        <Tab className={styles.search__tab} value='SearchPost'>Посты</Tab>
        <Tab className={styles.search__tab}>Пользователи</Tab>
      </TabsList>
      <TabPanel value='SearchPost'><SearchPost/></TabPanel>
      <TabPanel><SearchUser/></TabPanel>
    </Tabs>
  )
})

export default Search