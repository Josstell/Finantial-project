import { useQuery } from '@tanstack/react-query'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transaction', { id }],
    queryFn: async () => {
      const res = await client.api.transactions[':id'].$get({ param: { id } })

      console.log('res:', res)

      if (!res.ok) {
        throw new Error('Failed to fetch transaction')
      }
      const { data } = await res.json()
      return { ...data, amount: convertAmountFromMiliunits(data.amount) }
    },
  })
  return query
}
