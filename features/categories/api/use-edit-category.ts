import { toast } from 'sonner'
import { InferRequestType, InferResponseType } from 'hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { client } from '@/lib/hono'

type ResponseType = InferResponseType<
  (typeof client.api.categories)[':id']['$patch']
>
type RequestType = InferRequestType<
  (typeof client.api.categories)[':id']['$patch']
>['json']

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.categories[':id']['$patch']({
        json,
        param: { id },
      })
      return await res.json()
    },
    onSuccess: () => {
      toast.success('Category updated successfully')
      queryClient.invalidateQueries({ queryKey: ['category', { id }] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      toast.error(`Error editing category: ${error.message}`)
    },
  })
  return mutation
}
