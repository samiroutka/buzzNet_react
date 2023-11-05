import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import styles from './Post.module.scss'
import { Context } from '../../context'
import { TextField, Button } from '@mui/material'
import MyLoader from '../../components/UI/MyLoader/MyLoader'
import { Editor } from '@tinymce/tinymce-react';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const Post = () => {
  let apiUrl = import.meta.env.VITE_APIURL
  let navigateTo = useNavigate()
  let {userData, setUserData} = useContext(Context)
  let {postId} = useParams()
  let titleElement = useRef()
  let [isLoading, setIsLoading] = useState(false)
  let editorRef = useRef()
  let post = userData.posts.find(post => post.id == postId)

  let savePost = async () => {
    let formData = new FormData()
    formData.append('title', titleElement.current.querySelector('input').value)
    formData.append('content', editorRef.current.editor.getContent())
    let response = await fetch(`${apiUrl}users/${userData.name}/posts/${postId}`, {
      method: 'PUT',
      body: formData
    })
    response = await response.json()
    if (response) {
      userData.posts = response
      setUserData(userData)
    }
  }

  let deletePost = async () => {
    let response = await fetch(`${apiUrl}users/${userData.name}/posts/${postId}`, {
      method: 'DELETE',
    })
    response = await response.json()
    userData.posts = response
    setUserData(userData)
    navigateTo('/')
  }

  // ----------
  return (
    <>
    {Number(postId) <= userData.posts.length ? 
      <div className={styles.post}>
        {isLoading ? <MyLoader/> : <></>}
        <TextField ref={titleElement} className={styles.title} defaultValue={post.title} id="standard-basic" label="Название поста" variant="standard"/>
        <Editor initialValue={post.content} ref={editorRef} init={{
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        }}/>
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
      </div> : navigateTo(`/error/${postId}`)}
    </>
  )
}

export default Post