import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api.transactions)['bulk-create']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.transactions)['bulk-create']['$post']
>['json']

export const useBulkCreateTransacions = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.transactions['bulk-create']['$post']({
        json,
      })
      return await res.json()
    },
    onSuccess: () => {
      toast.success('Transactions created')
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })

      // TODO: Also invalidate summary
    },
    onError: (error) => {
      toast.error(`Fail to create transactions`)
    },
  })

  console.log('mutation:', mutation)

  return mutation
}
