import React, { useEffect, useState } from 'react'
import { Box, Button, Heading } from '@chakra-ui/react'
import ReportTable from '../components/ReportTable'
import ReportForm from '../components/ReportForm'
import UploadPreview from '../components/UploadPreview'
import { useAuth } from '../contexts/AuthContext'
import Calendar from '../components/Calendar'
import ReportView from '../components/ReportView'

export default function Reports() {
  const [data, setData] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [viewing, setViewing] = useState<any | null>(null)
  const [open, setOpen] = useState(false)
  const [meta, setMeta] = useState<any>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [markedDays, setMarkedDays] = useState<number[]>([])

  async function load(p = 1) {
    const res = await fetch(`/api/reports?page=${p}&limit=${limit}`)
    const json = await res.json()
    setData(json.data)
    setMeta(json.meta)
    setPage(json.meta.page)
  }

  async function loadMarkedDays(year: number, month: number) {
    // month is 0-based — use optimized endpoint
    const res = await fetch(`/api/reports/days?year=${year}&month=${month + 1}`)
    if (!res.ok) {
      setMarkedDays([])
      return
    }
    const json = await res.json()
    const days = (json.data || []).map((d: any) => Number(d.day))
    setMarkedDays(days.sort((a: number, b: number) => a - b))
  }

  useEffect(() => { load(1); const now = new Date(); loadMarkedDays(now.getFullYear(), now.getMonth()) }, [])

  function handleMonthChange(y: number, m: number) {
    loadMarkedDays(y, m)
  }

  async function handleDayClick(y: number, m: number, d: number) {
    const day = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const res = await fetch(`/api/reports?start=${day}&end=${day}&limit=1000`)
    const json = await res.json()
    setData(json.data)
    setMeta({ page: 1, total: json.data.length, totalPages: 1 })
  }

  function handleView(r: any) {
    setViewing(r)
  }

  function handleDeleted(id: number) {
    // after deletion just reload current page
    load(page)
  }

  const { user } = useAuth()

  return (
    <Box p={6}>
      <Heading mb={4}>Relatórios</Heading>
      <Box display="flex" gap={6} alignItems="flex-start">
        <Box width="320px">
          <Calendar markedDays={markedDays} onDayClick={handleDayClick} />
        </Box>
        <Box flex="1">
          {(!user || user.role !== 'assessoria') && (
            <Button mb={4} colorScheme="teal" onClick={() => { setEditing(null); setOpen(true) }}>Novo relatório</Button>
          )}
          <UploadPreview />
          <ReportTable data={data} onEdit={(r: any) => { setEditing(r); setOpen(true) }} onDelete={handleDeleted} onView={handleView} />
        </Box>
      </Box>

      <Box mt={4} display="flex" alignItems="center" gap={3}>
        <Button onClick={() => load(Math.max(1, page - 1))} disabled={meta && meta.page <= 1}>Anterior</Button>
        <Box> Página {meta ? meta.page : '-'} de {meta ? meta.totalPages : '-'} </Box>
        <Button onClick={() => load((meta ? meta.page : 1) + 1)} disabled={meta && meta.page >= meta.totalPages}>Próxima</Button>
      </Box>

      <ReportForm isOpen={open} onClose={() => setOpen(false)} onSaved={() => load(page)} initial={editing} />
      <ReportView isOpen={!!viewing} onClose={() => setViewing(null)} report={viewing} />
    </Box>
  )
}
