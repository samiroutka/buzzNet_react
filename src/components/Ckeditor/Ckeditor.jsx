import React, { useRef } from 'react'
import 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'

// This editor is NOT ready. If you want to use it, you will must finalize it

export const Ckeditor = ({inputValue, setIsLoading}) => {
  let editorRef = useRef()

  return (
    <CKEditor ref={editorRef}
      editor={ClassicEditor}
      onReady={editor => {
        console.log('editor is ready!', editor)
        setIsLoading(true)
      }}
    />
  )
}
