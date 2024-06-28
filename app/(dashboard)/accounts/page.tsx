'use client'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'
import { useBulkDeleteAccount } from '@/features/accounts/api/use-bulk-delete'
import { columns } from './colums'
import { DataTable } from '@/components/data-table'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { Skeleton } from '@/components/ui/skeleton'

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

const AccountsPage = (props: Props) => {
  const newAccount = useNewAccount()
  const deleteAccounts = useBulkDeleteAccount()
  const accountQuery = useGetAccounts()
  const accounts = accountQuery.data || []
  console.log('loading', accountQuery.isLoading)

  const isDisabled = accountQuery.isLoading || deleteAccounts.isPending

  if (accountQuery.isLoading) {
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
          <CardTitle className="text-xl line-clamp-1">Accounts page</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
          <Button size="sm" onClick={newAccount.onOpen}>
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="name"
            columns={columns}
            data={accounts}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id)
              deleteAccounts.mutate({ ids })
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

export default AccountsPage
