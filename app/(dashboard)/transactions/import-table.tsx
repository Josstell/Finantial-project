import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableHeadSelect } from './table-head-select'

type Props = {
  headers: string[]
  body: string[][]
  selectedColums: Record<string, string | null>
  onTableHeadSelectChange?: (columnIndex: number, value: string | null) => void
}

export const ImportTable = ({
  headers,
  body,
  selectedColums,
  onTableHeadSelectChange,
}: Props) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((_header, columnIndex) => (
              <TableHead key={columnIndex}>
                <TableHeadSelect
                  columnIndex={columnIndex}
                  selectedColums={selectedColums}
                  onChange={onTableHeadSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((row: string[], rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
