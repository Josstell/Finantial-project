'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { columns } from './colums'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useNewCategory } from '@/features/categories/hooks/use-new-category'
import { useBulkDeleteCategory } from '@/features/categories/api/use-bulk-delete-categories'
import { useGetCategories } from '@/features/categories/api/use-get-categories'

// const data = [
//   {
//     id: '728ed52f',
//     amount: 100,
//     status: 'pending',
//     email: 'm@example.com',
//   },
//   {
//     id: '728eddgvf',
//     amount: 100,
//     status: 'success',
//     email: 'q@example.com',
//   },
// ]

type Props = {}

const CategoriesPage = (props: Props) => {
  const newCategory = useNewCategory()
  const deleteCategories = useBulkDeleteCategory()
  const categoryQuery = useGetCategories()
  const categories = categoryQuery.data || []

  const isDisabled = categoryQuery.isLoading || deleteCategories.isPending

  if (categoryQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto  w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="max-w-screen-2xl mx-auto  w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Categories page
          </CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
          <Button size="sm" onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            columns={columns}
            data={categories}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id)
              deleteCategories.mutate({ ids })
            }}
            disabled={isDisabled}
          />
        </CardContent>
        {/* <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </div>
  )
}

export default CategoriesPage
