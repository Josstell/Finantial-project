import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<typeof client.api.categories.$post>
type RequestType = InferRequestType<typeof client.api.categories.$post>['json']

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.categories.$post({ json })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created successfully')
    },
    onError: (error) => {
      toast.error(`Error creating category: ${error.message}`)
    },
  })
  return mutation
}
