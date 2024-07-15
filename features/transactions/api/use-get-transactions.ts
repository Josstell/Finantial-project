import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { useSearchParams } from 'next/navigation'
import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetTransactions = () => {
  //TODO: Check if params are needed in the key
  const params = useSearchParams()
  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const accountId = params.get('accountId') || ''
  const query = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      })

      if (!res.ok) {
        throw new Error('Failed to fetch transactions')
      }
      const { data } = await res.json()

      return data.map((transaction) => ({
        ...transaction,
        amount: convertAmountFromMiliunits(transaction.amount),
      }))
    },
  })
  return query
}
