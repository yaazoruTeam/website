import React from 'react'
import CustomTableRow from './CustomTableRow'

export default {
  title: 'Components/CustomTableRow',
  component: CustomTableRow,
}

const sampleData = {
  phone1: '054-8494216',
  phone2: '054-8494926',
  name: 'אליעזר יוסקוביץ',
  address: 'הרב קוק 19, ב’, דירה 9',
  city: 'צפת',
  region: 'צפון',
  id: '24',
}

export const Default = () => <CustomTableRow data={sampleData} />
