import { Box } from '@mui/material'
import CountryList from './CountryList'
import EditingContactsForm from './EditingContactsForm'
import { CustomIconButton } from '../designComponent/ButtonIcon'
import { PlusIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState } from 'react'
export interface EditingContactsRef {
  submitForm: () => Promise<any>
}
const EditingContacts: React.FC<{ value: any; onChange: (data: any) => void }> = ({//to do:Change to an accurate type
  value,
  onChange,
}) => {
  const initialForms = Array.isArray(value) && value.length > 0 ? value.map((_, idx) => idx) : [0]

  const [forms, setForms] = useState<number[]>(initialForms)
  const [counter, setCounter] = useState(1)
  const formRefs = useRef<Record<number, any>>({})

  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      setForms(value.map((_, idx) => idx))
      setCounter(value.length)
    } else {
      setForms([0])
      setCounter(1)
    }
  }, [value])

  const handleAddForm = () => {
    setForms([...forms, counter])
    setCounter(counter + 1)
  }
  const handleFormChange = (index: number, data: any) => {//to do: Change to an accurate type
    const newData = Array.isArray(value) ? [...value] : []
    newData[index] = data
    onChange(newData)
  }

  return (
    <Box display='flex' flexDirection='column' gap={2}>
      <CountryList />
      {forms.map((formId, idx) => (
        <EditingContactsForm
          key={formId}
          ref={(el) => (formRefs.current[formId] = el)}
          value={value[idx] || {}}
          onChange={(data) => handleFormChange(idx, data)}
        />
      ))}

      <Box display='flex' justifyContent='flex-start'>
        <CustomIconButton
          icon={<PlusIcon />}
          buttonType='third'
          state='default'
          onClick={handleAddForm}
        />
      </Box>
    </Box>
  )
}

export default EditingContacts
