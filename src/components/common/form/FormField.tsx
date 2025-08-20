import {
  FormField as BaseFormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import * as React from "react";
import { type Control, type FieldValues, type Path } from "react-hook-form";

export type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  field: {
    name: Path<T>;
    label?: string;
    required?: boolean;
    optional?: boolean;
    render: React.ReactNode;
  };
  className?: string;
};

export const FormField = <T extends FieldValues>({
  control,
  field,
  className,
}: FormFieldProps<T>) => {
  return (
    <BaseFormField
      key={field.name}
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={cn("w-full space-y-1", className)}>
          {field.label && (
            <FormLabel className="gap-1 text-white">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              {field.optional && (
                <span className="text-text-inactive">(Optional)</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            {React.isValidElement(field.render)
              ? React.cloneElement(field.render as React.ReactElement, {
                  ...formField,
                })
              : field.render}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
