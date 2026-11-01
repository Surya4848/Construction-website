import axios from 'axios'
const KEY = 'jv_admin_token'
export const tokenStore = { get: () => localStorage.getItem(KEY), set: t => localStorage.setItem(KEY, t), clear: () => localStorage.removeItem(KEY) }
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', timeout: 20000 })
api.interceptors.request.use(c => { const t = tokenStore.get(); if (t) c.headers.Authorization = `Bearer ${t}`; return c })
api.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401 && tokenStore.get() && !e.config.url.includes('/auth/login')) { tokenStore.clear(); if (location.pathname.startsWith('/admin')) location.assign('/admin/login') }
  return Promise.reject(e)
})
export const errMsg = e => {
  const d = e.response?.data?.detail
  if (Array.isArray(d)) return d.map(x => `${(x.loc || []).slice(1).join('.')}: ${x.msg}`).join('; ')
  return d || (e.request && !e.response ? 'Cannot reach the server. Please try again.' : e.message) || 'Something went wrong'
}
