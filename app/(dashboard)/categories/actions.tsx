'use client'
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { useConfirm } from '@/hooks/use-confirm'
import { useDeleteCategory } from '@/features/categories/api/use-delete-category'
import { useOpenCategory } from '@/features/categories/hooks/use-open-category'

type Props = {
  id: string
}

export const Actions = ({ id }: Props) => {
  const [ConfirmationDialog, confirm] = useConfirm(
    'Are your sure?',
    'You are about to delete this Category.'
  )

  const deleteMutation = useDeleteCategory(id)
  const { onOpen } = useOpenCategory()

  const handleDelete = async () => {
    const ok = await confirm()
    if (ok) {
      deleteMutation.mutate()
    }
  }

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => onOpen(id)}
          >
            <Edit className="size-4 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" /> delete
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
