'use client'

import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { inserAcccountSchema } from '@/db/schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Trash } from 'lucide-react'

const formSchema = inserAcccountSchema.pick({
  name: true,
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  id?: string
  defaultValues?: FormValues
  onSubmit: (data: FormValues) => void
  onDelete?: () => void
  disabled?: boolean
}

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (values: FormValues) => {
    console.log({ values })
    onSubmit(values)
  }

  const handleDelete = () => {
    onDelete?.()
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Cash, Bank, Credit Card"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={disabled} type="submit" className="w-full">
          {id ? 'Save Changes' : 'Create Account'}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            onClick={handleDelete}
            className="w-full"
          >
            <Trash className="size-4 mr-5" />
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  )
}
