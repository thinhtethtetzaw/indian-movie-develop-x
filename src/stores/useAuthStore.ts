import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_STAGES } from '@/constants/common'

export type TUserData = {
  id: string
  email: string
  username: string
  fullname: string
  phone: string
  role: string
  status: string
}

type TAuthStore = {
  auth: {
    token: string
    stage: (typeof AUTH_STAGES)[keyof typeof AUTH_STAGES]
    userData: TUserData
  }
}

type TAuthStoreActions = {
  setAuth: (
    auth:
      | TAuthStore['auth']
      | ((prev: TAuthStore['auth']) => TAuthStore['auth']),
  ) => void
  resetAuth: () => void
}

const initialState: TAuthStore = {
  auth: {
    token: '',
    stage: AUTH_STAGES.UNAUTHENTICATED,
    userData: {
      id: '',
      email: '',
      username: '',
      fullname: '',
      phone: '',
      role: '',
      status: '',
    },
  },
}

export const useAuthStore = create<TAuthStore & TAuthStoreActions>()(
  persist(
    (set) => ({
      auth: initialState.auth,
      setAuth: (auth) =>
        set((state) => ({
          auth: typeof auth === 'function' ? auth(state.auth) : auth,
        })),
      resetAuth: () => {
        console.log('resetAuth')
        set(initialState)
      },
    }),
    {
      name: 'auth',
    },
  ),
)
