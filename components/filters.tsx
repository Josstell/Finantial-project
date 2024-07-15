import React from 'react'
import { AccountFilter } from './account-filter'
import { DateFilter } from './date-filter'

type Props = {}

export const Filters = (props: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-0">
      <AccountFilter />
      <DateFilter />
    </div>
  )
}
