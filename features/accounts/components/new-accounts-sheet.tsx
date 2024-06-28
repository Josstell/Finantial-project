import React from 'react'
import { z } from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'
import { inserAcccountSchema } from '@/db/schema'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { AccountForm } from './account-form'

const formSchema = inserAcccountSchema.pick({
  name: true,
})

type FormValues = z.infer<typeof formSchema>

type Props = {}

export const NewAccountsSheet = (props: Props) => {
  const { isOpen, onClose } = useNewAccount()
  const mutation = useCreateAccount()
  const onSubmit = (values: FormValues) => {
    console.log('form new account:', values)
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger>Open</SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: '',
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
