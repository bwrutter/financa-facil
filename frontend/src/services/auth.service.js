import api from './api'

export async function login(email, password) {
  const response = await api.post('/auth/login', {
    email,
    password,
  })

  const { token, user } = response.data

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return user
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}
