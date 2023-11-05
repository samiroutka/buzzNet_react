import React from 'react'
import styles from './Search.module.scss'
import { TextField, CircularProgress, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useRef } from 'react';
import { Tab, Tabs, TabsList, TabPanel } from '@mui/base';

const SearchHeader = ({searchFunction}) => {
  let inputRef = useRef()

  // ---------------------
  return (
    <div className={styles.search__header}>
      <TextField ref={inputRef} className={styles.search__searchField} placeholder='Название поста'/>
      <IconButton onClick={async () => {
        await searchFunction(inputRef)
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

  let searchPost = async (inputRef) => {
    setIsLoading(true)
    let inputValue = inputRef.current.querySelector('input').value
    let response = await fetch(`${apiUrl}posts/${inputValue}`)
    response = await response.json()
    setFoundPosts(response)
    setIsLoading(false)
  } 

  // --------------------
  return (
    <div className={styles.searchPost} {...props} ref={ref}>
      <SearchHeader searchFunction={searchPost}/>
      {isLoading ? <CircularProgress className={styles.loader}/> :
      <div className={styles.searchPost__posts}>
        {foundPosts[0] == 'Initial' ? <></>:
        foundPosts.length == 0 ?
        <p>Постов нету</p> :
        foundPosts.map(post => 
        <div className={styles.searchPost__post} key={Math.random()}>
          <p>{post.title}</p>
        </div>)}
      </div>}
    </div>
  )
})

const SearchUser = React.forwardRef((props, ref) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let [foundUsers, setFoundUsers] = useState(['Initial'])
  let [isLoading, setIsLoading] = useState(false)

  let searchUser = async (inputRef) => {
    setIsLoading(true)
    let inputValue = inputRef.current.querySelector('input').value
    let response = await fetch(`${apiUrl}user/${inputValue}`)
    response = await response.json()
    setFoundUsers(response)
    setIsLoading(false)
  }

  // --------------------
  return (
    <div className={styles.searchUser} {...props} ref={ref}>
      <SearchHeader searchFunction={searchUser}/>
      {isLoading ? <CircularProgress className={styles.loader}/> :
      <div className={styles.searchUser__users}>
        {foundUsers[0] == 'Initial' ? <></>:
        foundUsers.length == 0 ?
        <p>Страничек нету</p> :
        foundUsers.map(user => 
        <div key={user.name}>
          <p>{user.name}</p>
        </div>)}
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
        <Tab className={styles.search__tab}>Странички</Tab>
      </TabsList>
      <TabPanel value='SearchPost'><SearchPost/></TabPanel>
      <TabPanel><SearchUser/></TabPanel>
    </Tabs>
  )
})

export default Search