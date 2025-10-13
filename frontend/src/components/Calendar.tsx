import React, { useState, useEffect } from 'react'
import { Box, Flex, IconButton, Text, Grid, GridItem } from '@chakra-ui/react'

type Props = {
  year?: number
  month?: number // 0-based
  markedDays?: number[] // days of month that have reports
  onDayClick?: (y: number, m: number, d: number) => void
  onMonthChange?: (y: number, m: number) => void
}

function getMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1)
  const startDay = first.getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const rows: (number | null)[][] = []
  let week: (number | null)[] = Array(startDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d)
    if (week.length === 7) { rows.push(week); week = [] }
  }
  if (week.length) {
    while (week.length < 7) week.push(null)
    rows.push(week)
  }
  return rows
}

export default function Calendar({ year, month, markedDays = [], onDayClick, onMonthChange }: Props) {
  const now = new Date()
  const [y, setY] = useState<number>(year ?? now.getFullYear())
  const [m, setM] = useState<number>(month ?? now.getMonth())

  useEffect(() => { if (typeof year === 'number') setY(year) }, [year])
  useEffect(() => { if (typeof month === 'number') setM(month) }, [month])

  const matrix = getMonthMatrix(y, m)

  return (
    <Box borderWidth={1} borderRadius="md" p={3}>
      <Flex justify="space-between" align="center" mb={2}>
  <Box as="button" onClick={() => { const dt = new Date(y, m - 1, 1); setY(dt.getFullYear()); setM(dt.getMonth()); if (onMonthChange) onMonthChange(dt.getFullYear(), dt.getMonth()) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>{'<'}</Box>
        <Text fontWeight="bold">{new Date(y, m).toLocaleString(undefined, { month: 'long', year: 'numeric' })}</Text>
  <Box as="button" onClick={() => { const dt = new Date(y, m + 1, 1); setY(dt.getFullYear()); setM(dt.getMonth()); if (onMonthChange) onMonthChange(dt.getFullYear(), dt.getMonth()) }} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>{'>'}</Box>
      </Flex>

      <Grid templateColumns="repeat(7, 1fr)" gap={1} textAlign="center">
        {['Dom','Seg','Ter','Qua','Qui','Sex','Sab'].map(d => (
          <GridItem key={d} fontSize="xs" color="gray.500">{d}</GridItem>
        ))}
        {matrix.map((week, wi) => (
          week.map((day, di) => {
            const isMarked = day ? markedDays.includes(day) : false
            return (
              <GridItem key={`${wi}-${di}`} p={2} borderRadius="md" bg={isMarked ? 'teal.50' : 'transparent'} _hover={{ bg: 'gray.50', cursor: day ? 'pointer' : 'default' }} onClick={() => day && onDayClick && onDayClick(y, m, day)}>
                <Text fontSize="sm" color={day ? 'gray.800' : 'transparent'}>{day || ''}</Text>
              </GridItem>
            )
          })
        ))}
      </Grid>
    </Box>
  )
}
