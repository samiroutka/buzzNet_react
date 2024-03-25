import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import styles from './UserPagePost.module.scss'
import { Context } from '@/context'
import { TextField, Button } from '@mui/material'
import MyLoader from '@/components/UI/MyLoader/MyLoader'
import { Tinymce } from '@/components/Tinymce/Tinymce'
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import add_image from './add_image.svg';
import { MyTabs } from '@/components/MyTabs/MyTabs.jsx';
import { Ckeditor } from '@/components/Ckeditor/Ckeditor'

const UserPagePost = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let {userData, setUserData} = useContext(Context)
  let {postId} = useParams()
  let titleElement = useRef()
  let previewElement = useRef()
  let [isLoading, setIsLoading] = useState(true)
  let post = userData ? userData.posts.find(post => post.id == postId) : false
  let [previewImage, setPreviewImage] = useState(post.preview ? post.preview : add_image)
  let [editorGetContent, setEditorGetContent] = useState()

  useEffect(() => {
    setPreviewImage(post.preview ? post.preview : add_image)
  }, [userData])

  let savePost = async () => {
    let formData = new FormData()
    formData.append('title', titleElement.current.querySelector('input').value)
    formData.append('preview', previewElement.current.src.includes(location.host) ?
    '' : previewElement.current.src)
    formData.append('content', editorGetContent())
    let response = await fetch(`${apiUrl}user/${userData.name}/posts/${postId}`, {
      method: 'PUT',
      body: formData
    })
    response = await response.json()
    if (response) {
      userData.posts = response
      setUserData(userData)
      history.back()
    }
  }

  let deletePost = async () => {
    let response = await fetch(`${apiUrl}user/${userData.name}/posts/${postId}`, {
      method: 'DELETE',
    })
    response = await response.json()
    userData.posts = response
    setUserData(userData)
    navigateTo('/')
  }

  let checkPostId = () => {
    for (let post of userData.posts) {
      if (post.id == Number(postId)) {
         return true
      }
    }
    return false
  }

  // ----------
  return (
    <>
      {!userData ? <MyLoader/> :
         checkPostId() ? 
          <div className={styles.post}>
            {isLoading ? <MyLoader/> : <></>}
            <TextField ref={titleElement} className={styles.title} defaultValue={post.title} id="standard-basic" label="Название поста" variant="standard"/>
            <img ref={previewElement} src={previewImage} className={styles.preview} alt="preview" onClick={() => {
              let new_input = document.createElement('input')
              new_input.setAttribute('type', 'file')
              new_input.setAttribute('accept', 'image/*')
              new_input.onchange = async () => {
                setIsLoading(true)
                let formData = new FormData()
                formData.append('media', new_input.files[0])
                let response = await fetch(`${apiUrl}mediadowloading/images/`, {
                  method: 'post',
                  body: formData
                })
                setPreviewImage(`${apiUrl}${await response.json()}`)
                setIsLoading(false)
              }
              new_input.click()
            }}/>
            {/* <Tinymce inputValue={post.content} setIsLoading={setIsLoading} setEditorGetContent={setEditorGetContent}/> */}
            <Ckeditor inputValue={post.content} setIsLoading={setIsLoading} setEditorGetContent={setEditorGetContent}/>
            <Button className={styles.saveButton} onClick={async () => {
              setIsLoading(true)
              await savePost()
              setIsLoading(false)
            }} variant="contained" startIcon={<SaveIcon/>}>Сохранить</Button>
            <Button className={styles.deleteButton} onClick={async () => {
              setIsLoading(true)
              await deletePost()
              setIsLoading(false)
            }} variant="contained" startIcon={<DeleteIcon/>}>Удалить</Button>
          </div> :
        navigateTo(`/error/${postId}`)
      }
      <MyTabs/>
    </>
  )
}

export default UserPagePost