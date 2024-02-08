import React, { useState, useEffect, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import styles from './Tinymce.module.scss'
import MyLoaderMini from '@/components/UI/MyLoaderMini/MyLoaderMini'
import { Alert } from '@mui/material'

export const Tinymce = ({inputValue, setIsLoading, setEditorGetContent}) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let editorRef = useRef()
  let [mediaLoader, setMediaLoader] = useState(false)
  let [editorAlert, setEditorAlert] = useState(false)

  return (
    <>
      {mediaLoader ? <MyLoaderMini/> : null}
      {editorAlert ? <Alert className={styles.editorAlert} severity="info" onClose={() => {
        setEditorAlert(false)
      }}>Файл превышает 100 МБ</Alert> : null}
      <Editor initialValue={inputValue} ref={editorRef} onInit={() => {
          setEditorGetContent(() => {
            return () => {
              return editorRef.current.editor.getContent() // Я точно не знаю, но скорее всего нужно оборачивать функцию в другую (в данном случае стрелочную, но можно и в обычнку) чтобы сохранялся контекст. Иначе выдет ошибка (которая скорее всего связана с потерей контекста)
            }
          })
          setIsLoading(false)
        }} 
        apiKey='8u32lhtkmps2vrtow8ijpmalnzgrzmc2uoy7r1fiv3b4x8ep'
        init={{
          menubar: false,
          toolbar: 'undo redo | fontsize fontfamily bold italic | alignleft aligncenter alignright alignjustify | image media preview',
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
    </>
  )
}
