import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<typeof client.api.accounts.$post>
type RequestType = InferRequestType<typeof client.api.accounts.$post>['json']

export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.accounts.$post({ json })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Account created successfully')
    },
    onError: (error) => {
      toast.error(`Error creating account: ${error.message}`)
    },
  })
  return mutation
}
