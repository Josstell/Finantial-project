import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api.accounts)['bulk-delete']['$post']
>
type RequestType = InferRequestType<
  (typeof client.api.accounts)['bulk-delete']['$post']
>['json']

export const useBulkDeleteAccount = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.accounts['bulk-delete']['$post']({ json })
      return await res.json()
    },
    onSuccess: () => {
      toast.success('Accounts deleted')
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      // TODO: Also invalidate summary
    },
    onError: (error) => {
      toast.error(`Fail to delete accounts`)
    },
  })
  return mutation
}
