import React from 'react'

import { format } from 'date-fns'
import {
  Tooltip,
  XAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { CustomTooltip } from './custom-tooltip'

type Props = {
  data?: {
    date: string
    income: number
    expenses: number
  }[]
}

export const LineVariants = ({ data }: Props) => {
  return (
    <ResponsiveContainer width={'100%'} height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, 'dd MMMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          dot={false}
          dataKey="income"
          stroke="#3b82f6"
          strokeWidth={2}
          className="drop-shadow-md"
        />
        <Line
          dot={false}
          dataKey="expenses"
          stroke="#f43f5e"
          strokeWidth={2}
          className="drop-shadow-md"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
