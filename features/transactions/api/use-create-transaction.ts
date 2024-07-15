import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<typeof client.api.transactions.$post>
type RequestType = InferRequestType<
  typeof client.api.transactions.$post
>['json']

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.transactions.$post({ json })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })

      toast.success('Transaction created successfully')
    },
    onError: (error) => {
      console.log(error.message)

      toast.error(`Something went wrong creating transaction: ${error.message}`)
    },
  })
  return mutation
}
