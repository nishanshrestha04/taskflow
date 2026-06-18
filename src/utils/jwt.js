const SECRET = 'taskflow_secret_key'

export function createToken(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 }))
  const signature = btoa(`${header}.${body}.${SECRET}`)
  return `${header}.${body}.${signature}`
}

export function parseToken(token) {
  try {
    const [, body] = token.split('.')
    return JSON.parse(atob(body))
  } catch {
    return null
  }
}

export function isTokenValid(token) {
  if (!token) return false
  const payload = parseToken(token)
  if (!payload) return false
  return payload.exp > Date.now()
}

export function getTokenFromStorage() {
  return localStorage.getItem('taskflow_token')
}

export function setTokenInStorage(token) {
  localStorage.setItem('taskflow_token', token)
}

export function removeTokenFromStorage() {
  localStorage.removeItem('taskflow_token')
}
