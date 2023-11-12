
export let getUser = async (name, password) => {
  let apiUrl = import.meta.env.VITE_APIURL
  let formData = new FormData()
  formData.append('name', name)
  formData.append('password', password)
  let response = await fetch(`${apiUrl}login/`, {
    method: 'POST',
    body: formData,
  })
  response = await response.json()
  if (response.posts) {
    response.posts = JSON.parse(response.posts)
  }
  return response
}

export let getCookie = (document, name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export let rememberUser = (document, name, password) => {
  let maxAge = 120
  document.cookie = `name=${name};max-age=${maxAge}`    
  document.cookie = `password=${password};max-age=${maxAge}`    
}