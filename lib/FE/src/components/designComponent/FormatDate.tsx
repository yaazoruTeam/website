export const formatDateToString = (date: Date | string): string => {
  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() === 1999) {
    return '?'
  }
  const day = String(parsedDate.getDate()).padStart(2, '0')
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const year = parsedDate.getFullYear()

  return `${day}/${month}/${year}`
}
