'use client'
import React from 'react'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account'
import { inserAcccountSchema } from '@/db/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useEditAccount } from '../api/use-edit-account'
import { useDeleteAccount } from '../api/use-delete-account'
import { AccountForm } from './account-form'
import { useGetAccount } from '../api/use-get-account'

const formSchema = inserAcccountSchema.pick({
  name: true,
})

type FormValues = z.infer<typeof formSchema>

type Props = {}

export const EditAccountsSheet = (props: Props) => {
  const { isOpen, onClose, id } = useOpenAccount()

  const accountQuery = useGetAccount(id)
  const editMutation = useEditAccount(id)
  const deleteMutation = useDeleteAccount(id)

  const isPending = editMutation.isPending || deleteMutation.isPending
  const isLoading = accountQuery.isLoading

  const [ConfirmationDialog, confirm] = useConfirm(
    'Are your sure?',
    'You are about to delete this transaction.'
  )

  console.log('Edit', accountQuery)

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const onDelete = async () => {
    const ok = await confirm()
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name,
      }
    : {
        name: '',
      }

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        {/* <SheetTrigger>Open</SheetTrigger> */}
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Edit an account to track your transactions.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
