import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import styles from './UserPagePost.module.scss'
import { Context } from '../../context'
import { TextField, Button, CircularProgress, Alert } from '@mui/material'
import MyLoader from '../../components/UI/MyLoader/MyLoader'
import { Editor } from '@tinymce/tinymce-react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import add_image from './add_image.svg';

const UserPagePost = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let {userData, setUserData} = useContext(Context)
  let {postId} = useParams()
  let titleElement = useRef()
  let previewElement = useRef()
  let [isLoading, setIsLoading] = useState(true)
  let editorRef = useRef()
  let post = userData ? userData.posts.find(post => post.id == postId) : false
  let [mediaLoader, setMediaLoader] = useState(false)
  let [editorAlert, setEditorAlert] = useState(false)
  let [previewImage, setPreviewImage] = useState(post.preview ? post.preview : add_image)

  useEffect(() => {
    setPreviewImage(post.preview ? post.preview : add_image)
  }, [userData])

  let savePost = async () => {
    let formData = new FormData()
    formData.append('title', titleElement.current.querySelector('input').value)
    formData.append('preview', previewElement.current.src.includes(location.host) ?
    '' : previewElement.current.src)
    formData.append('content', editorRef.current.editor.getContent())
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
                setMediaLoader(true)
                let formData = new FormData()
                formData.append('media', new_input.files[0])
                let response = await fetch(`${apiUrl}mediadowloading/images/`, {
                  method: 'post',
                  body: formData
                })
                setPreviewImage(`${apiUrl}${await response.json()}`)
                setMediaLoader(false)
              }
              new_input.click()
            }}/>
            {mediaLoader ? <div className={styles.mediaLoader}><CircularProgress/></div> : null}
            {editorAlert ? <Alert className={styles.editorAlert} severity="info" onClose={() => {
              setEditorAlert(false)
            }}>Файл превышает 100 МБ</Alert> : null}
            <Editor initialValue={post.content} ref={editorRef} onInit={() => {
              setIsLoading(false)
              }} init={{
                menubar: false,
                toolbar: 'undo redo | fontsize fontfamily bold italic | alignleft aligncenter alignright alignjustify | image media preview',
                // plugins: 'image media preview imagetools searchreplace',
                plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste imagetools wordcount',
                file_picker_types: 'image media',
                file_picker_callback: (cb, value, meta) => {
                  let file_input = document.createElement('input')
                  file_input.setAttribute('type', 'file')
                  file_input.setAttribute('accept', meta.filetype == 'image' ? 'image/*' : 'video/*')
                  file_input.onchange = async () => {
                    if (file_input.files[0].size/1048576 <= 100) {
                      setMediaLoader(true)
                      let formData = new FormData()
                      formData.append('media', file_input.files[0])
                      let response = await fetch(`${apiUrl}${meta.filetype == 'image' ? 'mediadowloading/images/' : 'mediadowloading/videos/'}`, {
                        method: 'post',
                        body: formData
                      })
                      cb(`${apiUrl}${await response.json()}`)
                      setMediaLoader(false)
                    } else {
                      setEditorAlert(true)
                    }
                  }
                  file_input.click()
                }
              }}
            />
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
    </>
  )
}

export default UserPagePost