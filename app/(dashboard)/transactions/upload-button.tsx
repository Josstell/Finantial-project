import React from 'react'
import { Upload } from 'lucide-react'
import { useCSVReader } from 'react-papaparse'

import { Button } from '@/components/ui/button'

type Props = {
  onUpload: (results: any[]) => void
}

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader()

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps, buttonProps }: any) => (
        <Button
          variant="outline"
          size="sm"
          className="w-full lg:w-auto"
          {...getRootProps()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      )}
    </CSVReader>
  )
}
