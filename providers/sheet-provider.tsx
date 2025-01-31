'use client'

import React from 'react'
import { useMountedState } from 'react-use'

import { EditAccountsSheet } from '@/features/accounts/components/edit-accounts-sheet'
import { NewAccountsSheet } from '@/features/accounts/components/new-accounts-sheet'
import { EditCategoriesSheet } from '@/features/categories/components/edit-category-sheet'
import { NewCategorySheet } from '@/features/categories/components/new-category-sheet'
import { NewTransactionSheet } from '@/features/transactions/components/new-transaction-sheet'
import { EditTransactionSheet } from '@/features/transactions/components/edit-transaction-sheet'

type Props = {}

export const SheetProvider = (props: Props) => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <NewAccountsSheet />
      <EditAccountsSheet />
      <NewCategorySheet />
      <EditCategoriesSheet />
      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  )
}
