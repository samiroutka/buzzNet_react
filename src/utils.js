
export function getCookie(document, name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export let rememberUser = (document, name, password) => {
  let maxAge = 120
  document.cookie = `name=${name};max-age=${maxAge}`    
  document.cookie = `password=${password};max-age=${maxAge}`    
}