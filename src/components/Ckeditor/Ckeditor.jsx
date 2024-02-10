import React, { useRef } from 'react'
import 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'

// This editor is NOT ready. If you want to use it, you will must finalize it

export const Ckeditor = ({inputValue, setIsLoading, setEditorGetContent}) => {
  let editorRef = useRef()

  return (
    <CKEditor ref={editorRef}
      editor={ClassicEditor}
      onReady={editor => {
        editorRef.current.editor.setData(inputValue)
        console.log('editor is ready!', editor)
        setEditorGetContent(() => {
          return () => {
            return editorRef.current.editor.getData() // Я точно не знаю, но скорее всего нужно оборачивать функцию в другую (в данном случае стрелочную, но можно и в обычнку) чтобы сохранялся контекст. Иначе выдет ошибка (которая скорее всего связана с потерей контекста)
          }
        })
        setIsLoading(false)
      }}
    />
  )
}
