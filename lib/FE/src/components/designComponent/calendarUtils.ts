export const generateCalendarDays = (currentMonth: Date): Date[] => {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)

  const startDayOfWeek = firstDay.getDay()
  startDate.setDate(startDate.getDate() - startDayOfWeek)

  const days = []
  const current = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}
