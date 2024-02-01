import React, { useEffect, useState, useRef, useContext } from 'react'
import styles from './Post.module.scss'
import { useParams } from 'react-router';
import { useNavigate } from 'react-router'
import { Context } from '@/context';
import MyLoader from '@/components/UI/MyLoader/MyLoader';
import MyLoaderMini from '@/components/UI/MyLoaderMini/MyLoaderMini';
import { Avatar } from '@mui/material';
import { MyTabs } from '@/components/MyTabs/MyTabs.jsx';
import arrow_up_white from './images/arrow-up-white.svg'
import arrow_up_black from './images/arrow-up-black.svg'
import arrow_down_white from './images/arrow-down-white.svg'
import arrow_down_black from './images/arrow-down-black.svg'
import arrow_show from './images/arrow-show.svg'

const Post = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let {user, id} = useParams()
  let {userData} = useContext(Context)
  let [isLoading, setIsLoading] = useState(true)
  let [isMyLoaderMini, setIsMyLoaderMini] = useState(false)
  let [postData, setPostData] = useState(false)
  let contentRef = useRef()
  let rateWrapperRef = useRef()
  let postScoreRef = useRef()
  let navigateTo = useNavigate()

  let getPost = async () => {
    setIsLoading(true)
    let response = await fetch(`${apiUrl}user/${user}/posts/${id}`)
    response = await response.json()
    if (response) {
      setPostData(response)
      setIsLoading(false)
    }
  }

  let rate = async (type, add_remove) => {
    setIsMyLoaderMini(true)
    let formData = new FormData()
    if (add_remove == 'add'){
      if (type == 'tops') {
        formData.append('tops', JSON.stringify([...postData.tops, userData.name]))
        if (postData.bottoms.indexOf(userData.name) != -1) {
          postData.bottoms.splice(postData.bottoms.indexOf(userData.name), 1)
          setPostData(postData)
          formData.append('bottoms', JSON.stringify(postData.bottoms))
        }
      } else if (type == 'bottoms') {
        formData.append('bottoms', JSON.stringify([...postData.bottoms, userData.name]))
        if (postData.tops.indexOf(userData.name) != -1) {
          postData.tops.splice(postData.tops.indexOf(userData.name), 1)
          setPostData(postData)
          formData.append('tops', JSON.stringify(postData.tops))
        }
      }
    } else if (add_remove == 'remove') {
      if (type == 'tops') {
        postData.tops.splice(postData.tops.indexOf(userData.name), 1)
        setPostData(postData)
        formData.append('tops', JSON.stringify(postData.tops))
      } else if (type == 'bottoms') {
        postData.bottoms.splice(postData.bottoms.indexOf(userData.name), 1)
        setPostData(postData)
        formData.append('bottoms', JSON.stringify(postData.bottoms))
      }
    }
    let response = await fetch(`${apiUrl}user/${user}/posts/${id}`, {
      method: 'put',
      body: formData,
    })
    response = await response.json()
    setPostData(response[id-1])
    setIsMyLoaderMini(false)
  }

  let changePostScore = () => {
    let postScore = postData.tops.length - postData.bottoms.length
    postScore > 0 ? postScoreRef.current.classList.add(styles.Post__rate_score_plus) :
    postScore < 0 ? postScoreRef.current.classList.add(styles.Post__rate_score_minus) : 
    postScore == 0 ? postScoreRef.current.classList.remove(styles.Post__rate_score_plus, styles.Post__rate_score_minus) : null
  }

  useEffect(() => {
    getPost()
  }, [])

  useEffect(() => {
    postData ? changePostScore() : null
  }, [postData])

  // --------------------
  return (
    <>
      {isLoading ? <MyLoader/> :
        <>
          {isMyLoaderMini ? <MyLoaderMini/> : null}
          <div className={styles.Post__header_wrapper}>
            <div className={styles.Post__header}>
              <h1 className={styles.Post__title}>{postData.title}</h1>
              <Avatar src={`${apiUrl}${postData.avatar}`} onClick={() => {navigateTo(`/users/${user}/`)}}/>
            </div>
          </div>
      
          <div ref={rateWrapperRef} className={styles.Post__rate_wrapper}>
            <div className={styles.Post__rate}>
              <img className={styles.Post__rate_top} src={postData.tops.includes(userData.name) ? arrow_up_black : arrow_up_white} onClick={() => {rate('tops', postData.tops.includes(userData.name) ? 'remove' : 'add')}}/>
              <p ref={postScoreRef} className={styles.Post__rate_score}>{postData.tops.length - postData.bottoms.length}</p>
              <img className={styles.Post__rate_bottom} src={postData.bottoms.includes(userData.name) ? arrow_down_black : arrow_down_white} onClick={() => {rate('bottoms', postData.bottoms.includes(userData.name) ? 'remove' : 'add')}}/>
            </div>
            <div className={styles.Post__rate_showbtn} onClickCapture={event => {
              event.stopPropagation()
              rateWrapperRef.current.classList.toggle(styles.Post__rate_wrapper_close)
            }}>
              <img src={arrow_show}/>
            </div>
          </div>
          
          <div className={styles.Post}>
            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: postData ? postData.content : false  }} className={styles.Post__content}></div>
          </div>
          <MyTabs/>
        </>
      }
    </>
  )
}

export default Post
