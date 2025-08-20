import { create } from 'zustand'
import type { ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'
import type { buttonVariants } from '@/components/ui/button'

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export type Dialog<T = unknown> = {
  dialog:
    | {
        isAlert?: boolean
        size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
        icon?: ReactNode
        title?: string
        titleClassName?: string
        description?: string
        descriptionClassName?: string
        children?: ReactNode | ((...args: Array<T>) => ReactNode)
        className?: string
        showCloseButton?: boolean
        cancel?:
          | (ButtonProps & {
              label?: string
              onClick?: () => void
            })
          | null
        action?:
          | (ButtonProps & {
              label?: string
              onClick?: () => void | Promise<void>
            })
          | null
        onClose?: () => void
      }
    | undefined
}

type DialogActions = {
  showDialog: (dialog: Dialog) => void
  hideDialog: () => void
}

const initialState: Dialog = {
  dialog: undefined,
}

export const useDialogStore = create<Dialog & DialogActions>((set) => ({
  dialog: initialState.dialog,
  showDialog: (dialog) => set({ ...dialog }),
  hideDialog: () => set({ ...initialState }),
}))
