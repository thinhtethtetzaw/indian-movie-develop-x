import { toast } from 'sonner'
import Axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/config/env'
import { useAuthStore } from '@/stores/useAuthStore'

const PUBLIC_BASE_URLS: Array<string> = []

function requestInterceptor(config: InternalAxiosRequestConfig) {
  const authStore = useAuthStore.getState().auth

  config.headers.Accept = 'application/json'
  config.withCredentials = !PUBLIC_BASE_URLS.includes(config.baseURL || '')
  const token = authStore.token

  if (config.withCredentials && !!token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

function handleResponseError(error: any) {
  const resetAuth = useAuthStore.getState().resetAuth

  toast.error(error.response?.data.message)
  if (error.response?.status === 401 || error.response?.status === 403) {
    resetAuth()
    window.location.href = '/login'
    return new Response(error.response.data, { status: error.response.status })
  } else {
    console.error('API Error:', error)
  }
  return Promise.reject(error)
}

export function createAxiosClient(baseURL: string) {
  const client = Axios.create({ baseURL })
  client.interceptors.request.use(requestInterceptor)
  client.interceptors.response.use((response) => response, handleResponseError)
  return client
}

export const AXIOS_CLIENT = createAxiosClient(API_BASE_URL)
