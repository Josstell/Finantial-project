import React from 'react'
import { z } from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { useNewCategory } from '../hooks/use-new-category'
import { useCreateCategory } from '../api/use-create-category'
import { inserCategorySchema } from '@/db/schema'
import { CategoryForm } from './category-form'

const formSchema = inserCategorySchema.pick({
  name: true,
})

type FormValues = z.infer<typeof formSchema>

type Props = {}

export const NewCategorySheet = (props: Props) => {
  const { isOpen, onClose } = useNewCategory()
  const mutation = useCreateCategory()
  const onSubmit = (values: FormValues) => {
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
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new Category to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
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
