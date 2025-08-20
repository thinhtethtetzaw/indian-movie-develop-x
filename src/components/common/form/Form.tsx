import React, { createContext } from 'react'
import { useFormContext } from 'react-hook-form'
import type {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from 'react-hook-form'
import { FormField } from '@/components/common/form/FormField'
import { PasswordInput } from '@/components/common/form/PasswordInput'
import TextareaInput from '@/components/common/form/TextareaInput'
import { Checkbox } from '@/components/ui/checkbox'
import { Form as BaseForm } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const FormMethodsContext = createContext<UseFormReturn<FieldValues> | null>(
  null,
)

type FormProps<T extends FieldValues> = {
  id: string
  formMethods: UseFormReturn<T>
  onSubmit: (data: T) => void
  className?: string
  children: React.ReactNode
}

function Form<T extends FieldValues>({
  id,
  formMethods,
  onSubmit,
  className,
  children,
}: FormProps<T>) {
  return (
    <FormMethodsContext.Provider
      value={formMethods as UseFormReturn<FieldValues>}
    >
      <BaseForm {...formMethods}>
        <form
          id={id}
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className={className}
          noValidate
        >
          {children}
        </form>
      </BaseForm>
    </FormMethodsContext.Provider>
  )
}

Form.InputField = function InputField<T extends FieldValues = FieldValues>({
  name,
  label,
  required = false,
  ...props
}: {
  name: FieldPath<T>
  label?: string
  required?: boolean
} & React.ComponentProps<typeof Input>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      className="w-full"
      control={control}
      field={{
        name,
        label,
        required,
        render: <Input className="h-12 rounded-lg text-white" {...props} />,
      }}
    />
  )
}

Form.PasswordField = function PasswordField<
  T extends FieldValues = FieldValues,
>({
  name,
  label,
  ...props
}: { name: FieldPath<T> } & React.ComponentProps<typeof PasswordInput>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      className="w-full"
      control={control}
      field={{
        name,
        label,
        render: <PasswordInput {...props} />,
      }}
    />
  )
}

Form.TextareaField = function TextareaField<
  T extends FieldValues = FieldValues,
>({
  name,
  label,
  optional = false,
  ...props
}: { name: FieldPath<T>; optional?: boolean } & React.ComponentProps<
  typeof TextareaInput
>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      field={{
        name,
        label,
        optional,
        render: <TextareaInput {...props} />,
      }}
    />
  )
}

Form.CheckboxField = function CheckboxField<
  T extends FieldValues = FieldValues,
>({
  name,
  label,
  ...props
}: { name: FieldPath<T>; label?: string } & Omit<
  React.ComponentProps<typeof Checkbox>,
  'value'
>) {
  const { control } = useFormContext<T>()
  return (
    <FormField
      control={control}
      field={{
        name,
        render: (
          <Checkbox
            value={name}
            className="border-primary-pink data-[state=checked]:border-primary-pink data-[state=checked]:bg-primary-pink"
            {...props}
          />
        ),
      }}
    />
  )
}

Form.SwitchField = function SwitchField<T extends FieldValues = FieldValues>({
  name,
  className,
  ...props
}: {
  name: FieldPath<T>
  className?: string
} & Omit<React.ComponentProps<typeof Switch>, 'checked' | 'onCheckedChange'>) {
  const { control, setValue, watch } = useFormContext<T>()
  const value = watch(name)
  return (
    <FormField
      control={control}
      className={cn('w-full', className)}
      field={{
        name,
        render: (
          <div className="flex items-center">
            <Switch
              {...props}
              checked={!!value}
              onCheckedChange={(checked) =>
                setValue(name, checked as PathValue<T, Path<T>>)
              }
            />
          </div>
        ),
      }}
    />
  )
}

export { Form }
