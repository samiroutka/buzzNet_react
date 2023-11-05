import React from 'react'
import { useParams } from 'react-router';

const Error = () => {
  let {wrongPath} = useParams()

  // --------------------
  return (
    <div>
      <h1>There is no path {wrongPath ? '/'+wrongPath : window.location.pathname}</h1>
    </div>
  )
}

export default Error