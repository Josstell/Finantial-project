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

import { inserCategorySchema } from '@/db/schema'

import { useConfirm } from '@/hooks/use-confirm'
import { useOpenCategory } from '../hooks/use-open-category'
import { useGetCategory } from '../api/use-get-category'
import { useEditCategory } from '../api/use-edit-category'
import { useDeleteCategory } from '../api/use-delete-category'
import { CategoryForm } from './category-form'

const formSchema = inserCategorySchema.pick({
  name: true,
})

type FormValues = z.infer<typeof formSchema>

type Props = {}

export const EditCategoriesSheet = (props: Props) => {
  const { isOpen, onClose, id } = useOpenCategory()

  const categoryQuery = useGetCategory(id)
  const editMutation = useEditCategory(id)
  const deleteMutation = useDeleteCategory(id)

  const isPending = editMutation.isPending || deleteMutation.isPending
  const isLoading = categoryQuery.isLoading

  const [ConfirmationDialog, confirm] = useConfirm(
    'Are your sure?',
    'You are about to delete this category.'
  )

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

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
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
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              Edit an category to track your transactions.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
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
