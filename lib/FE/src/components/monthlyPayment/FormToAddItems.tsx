import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import ItemForm from './AddItemForm'
import { TrashIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/outline'
import { ItemForMonthlyPayment } from '../../model/src'
import { useTranslation } from 'react-i18next'
import { CustomButton } from '../designComponent/Button'
import { colors } from '../../styles/theme'
import { CustomTextField } from '../designComponent/Input'
import { useForm } from 'react-hook-form'
import CustomSelect from '../designComponent/CustomSelect'
import CustomTypography from '../designComponent/Typography'

const FormToAddItems: React.FC<{
  onItemsChange: (items: ItemForMonthlyPayment.Model[]) => void
  initialItems?: ItemForMonthlyPayment.Model[]
}> = ({ onItemsChange, initialItems }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [items, setItems] = useState<ItemForMonthlyPayment.Model[]>(initialItems || [])
  const [formAddItem, setFormAddItem] = useState<boolean>(false)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const { control, handleSubmit, watch, setValue } = useForm<ItemForMonthlyPayment.Model>()

  useEffect(() => {
    if (initialItems && JSON.stringify(initialItems) !== JSON.stringify(items)) {
      setItems(initialItems)
    }
  }, [initialItems, items])

  useEffect(() => {
    if (editingItem !== null) {
      const itemToEdit = items[editingItem]
      setValue('description', itemToEdit.description)
      setValue('quantity', itemToEdit.quantity)
      setValue('price', itemToEdit.price)
      setValue('total', itemToEdit.total)
      setValue('paymentType', itemToEdit.paymentType)
      setValue('item_id', itemToEdit.item_id)
      setValue('created_at', itemToEdit.created_at)
      setValue('update_at', itemToEdit.update_at)
    }
  }, [editingItem, items, setValue])

  const quantity = watch('quantity')
  const price = watch('price')

  useEffect(() => {
    if (quantity && price) {
      const total = Number(quantity) * Number(price)
      setValue('total', total)
    }
  }, [quantity, price, setValue])

  const addItem = (data: ItemForMonthlyPayment.Model) => {
    console.log(data)
    setItems((prevItems) => [...prevItems, data])
    setFormAddItem(false)
  }

  const deleteItem = (itemToDelete: ItemForMonthlyPayment.Model) => {
    console.log('delete item', itemToDelete)
    setItems((prevItems) => prevItems.filter((item) => item !== itemToDelete))
  }

  const editItem = (index: number) => {
    setEditingItem(index)
  }

  const saveEditedItem = (data: ItemForMonthlyPayment.Model) => {
    setItems((prevItems) =>
      prevItems.map((item, i) => (i === editingItem ? { ...item, ...data } : item)),
    )
    setEditingItem(null)
  }

  useEffect(() => {
    onItemsChange(items)
  }, [items, onItemsChange])

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        padding: 28,
        background: 'white',
        borderRadius: 6,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        gap: 28,
        display: 'inline-flex',
        direction: 'rtl',
        textAlign: 'right',
      }}
    >
      <CustomTypography
        text={t('items')}
        variant='h2'
        weight='medium'
        color={colors.c2}
        sx={{ textAlign: 'right', marginLeft: 'auto' }}
      />
      <TableContainer>
        <Table
          sx={{
            direction: 'rtl',
            '& .MuiTableHead-root': {
              borderBottom: `2px solid ${colors.c15}`,
            },
            '& .MuiTableFooter-root': {
              borderTop: `2px solid ${colors.c15}`,
            },
            '& .MuiTableCell-root': {
              border: 'none',
            },
          }}
        >
          <TableHead style={{ direction: 'rtl' }}>
            <TableRow style={{ direction: 'rtl' }}>
              <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                <CustomTypography
                  text={t('paymentType')}
                  variant='h4'
                  weight='regular'
                  color={colors.c2}
                />
              </TableCell>
              <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                <CustomTypography
                  text={t('description')}
                  variant='h4'
                  weight='regular'
                  color={colors.c2}
                />
              </TableCell>
              <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                <CustomTypography
                  text={t('amount')}
                  variant='h4'
                  weight='regular'
                  color={colors.c2}
                />
              </TableCell>
              <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                <CustomTypography
                  text={t('price')}
                  variant='h4'
                  weight='regular'
                  color={colors.c2}
                />
              </TableCell>
              <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                <CustomTypography
                  text={t('total')}
                  variant='h4'
                  weight='regular'
                  color={colors.c2}
                />
              </TableCell>
              <TableCell style={{ direction: 'rtl', textAlign: 'right' }}></TableCell>
              <TableCell style={{ direction: 'rtl', textAlign: 'right' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ direction: 'rtl' }}>
            {items.length > 0 ? (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                    {editingItem === index ? (
                      <CustomSelect
                        label=''
                        name='paymentType'
                        control={control}
                        options={[
                          { label: t('standingOrder'), value: t('standingOrder') },
                          { label: t('oneTimePayment'), value: t('oneTimePayment') },
                        ]}
                      />
                    ) : (
                      <CustomTypography
                        text={item.paymentType.toString()}
                        variant='h4'
                        weight='regular'
                        color={colors.c0}
                      />
                    )}
                  </TableCell>
                  <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                    {editingItem === index ? (
                      <CustomTextField
                        control={control}
                        name='description'
                        placeholder={t('InstructionForDescription')}
                      />
                    ) : (
                      <CustomTypography
                        text={item.description.toString()}
                        variant='h4'
                        weight='regular'
                        color={colors.c0}
                      />
                    )}
                  </TableCell>
                  <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                    {editingItem === index ? (
                      <CustomTextField
                        control={control}
                        name='quantity'
                        placeholder={t('InstructionForAmount')}
                      />
                    ) : (
                      <CustomTypography
                        text={item.quantity.toString()}
                        variant='h4'
                        weight='regular'
                        color={colors.c0}
                      />
                    )}
                  </TableCell>
                  <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                    {editingItem === index ? (
                      <CustomTextField control={control} name='price' placeholder={t('price')} />
                    ) : (
                      <CustomTypography
                        text={item.price.toString()}
                        variant='h4'
                        weight='regular'
                        color={colors.c0}
                      />
                    )}
                  </TableCell>
                  <TableCell style={{ direction: 'rtl', textAlign: 'right' }}>
                    {editingItem === index ? (
                      <CustomTextField control={control} name='total' placeholder='₪ 0.00' />
                    ) : (
                      <CustomTypography
                        text={item.total.toString()}
                        variant='h4'
                        weight='regular'
                        color={colors.c0}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      borderBottom: '2px solid transparent',
                      borderTop: '2px solid transparent',
                      padding: 0,
                      textAlign: 'right',
                      direction: 'rtl',
                    }}
                  >
                    {editingItem === index ? (
                      <CustomButton
                        label={t('approval')}
                        size={isMobile ? 'small' : 'large'}
                        state='hover'
                        buttonType='first'
                        onClick={handleSubmit(saveEditedItem)}
                      />
                    ) : (
                      <PencilIcon
                        style={{
                          width: '24px',
                          height: '24px',
                          color: colors.c2,
                          cursor: 'pointer',
                        }}
                        onClick={() => editItem(index)}
                      />
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      borderBottom: '2px solid transparent',
                      borderTop: '2px solid transparent',
                      padding: 0,
                      textAlign: 'right',
                      direction: 'rtl',
                    }}
                  >
                    <TrashIcon
                      style={{ width: '24px', height: '24px', color: colors.c2, cursor: 'pointer' }}
                      onClick={() => deleteItem(item)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: 'center' }}>
                  <CustomTypography
                    text={t('noItemToDisplay')}
                    variant='h4'
                    weight='regular'
                    color={colors.c0}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {formAddItem ? <ItemForm onSubmit={addItem} setFormAddItem={setFormAddItem} /> : ''}
      <CustomButton
        label={t('addItem')}
        size={isMobile ? 'small' : 'large'}
        state='active'
        buttonType='second'
        onClick={() => setFormAddItem(true)}
        style={{ textAlign: 'right', marginLeft: 'auto' }}
      />
    </Box>
  )
}

export default FormToAddItems
