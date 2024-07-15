import React from 'react'

import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils'
import { Separator } from './ui/separator'

type Props = {}

export const CustomTooltip = ({ active, payload }: any) => {
  if (!active) return null
  const date = payload[0].payload.date
  const income = payload[0].value
  const expenses = payload[1].value
  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {format(date, 'MMM dd, yyyy')}
      </div>
      <Separator className="my-1" />
      <div className="px-3 pb-2">
        <p className="text-sm font-medium text-gray-900">Income</p>
        <p className="mt-1 text-sm text-gray-700">{formatCurrency(income)}</p>
      </div>
      <Separator className="my-1" />
      <div className="px-3 p-2 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-blue-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Income</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(income)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-rose-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(expenses * -1)}
          </p>
        </div>
      </div>
      <Separator className="my-1" />
    </div>
  )
}
