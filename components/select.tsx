'use client'
import React from 'react'

import { useMemo } from 'react'
import { SingleValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'

type Props = {
  onChange: (value?: string) => void
  onCreate?: (value: string) => void
  options?: { label: string; value: string }[]
  value?: string | null | undefined
  disabled?: boolean
  placeholder?: string
}

export const Select = ({
  onChange,
  onCreate,
  options = [],
  placeholder,
  disabled,
  value,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    if (option?.value) {
      onChange(option.value)
    } else {
      onChange(undefined)
    }
  }
  const formatedValue = useMemo(() => {
    return options.find((option) => option.value === value)
  }, [options, value])

  return (
    <CreatableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#e2e8f0',
          ':hover': {
            boderColor: '#e2e8f0',
          },
        }),
      }}
      value={formatedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  )
}
