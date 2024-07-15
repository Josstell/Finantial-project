'use client'
import React, { useState } from 'react'

import { transactions as transactionSchema } from '@/db/schema'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { columns } from './colums'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { useBulkDeleteTransacions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'
import { UploadButton } from './upload-button'
import { ImportCard } from './import-card'
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account'
import { useBulkCreateTransacions } from '@/features/transactions/api/use-bulk-create-transactions'
import { toast } from 'sonner'

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

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
}

type Props = {}

const TransactionsPage = (props: Props) => {
  const [AccountDialog, confirm] = useSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log({ results })

    setImportResults(results)
    setVariant(VARIANTS.IMPORT)
  }
  const onCancelImport = () => {
    setVariant(VARIANTS.LIST)
    setImportResults(INITIAL_IMPORT_RESULTS)
  }

  // const [transactions, setTransactions] = useState<typeof data>(data
  const newTransaction = useNewTransaction()
  const bulkCreateMutation = useBulkCreateTransacions()
  const deleteTransactions = useBulkDeleteTransacions()
  const transactionsQuery = useGetTransactions()
  const transactions = transactionsQuery.data || []

  const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

  console.log('Transactions: ', transactionsQuery)

  if (transactionsQuery.isLoading) {
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

  const onSubmitImport = async (
    values: (typeof transactionSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm()
    if (!accountId) {
      return toast.error('Please select an account to conitnue.')
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }))
    bulkCreateMutation.mutate(data, {
      onSuccess: () => {
        onCancelImport()
      },
    })
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }
  return (
    <div className="max-w-screen-2xl mx-auto  w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions page
          </CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}

          <div className="flex flex-col lg:flex-row items-center gap-y-2 gap-x-2">
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} className="w-full lg:w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="payee"
            columns={columns}
            data={transactions}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id)
              deleteTransactions.mutate({ ids })
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

export default TransactionsPage
