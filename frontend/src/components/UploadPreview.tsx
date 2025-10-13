import React, { useState } from 'react'
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, useToast } from '@chakra-ui/react'
import * as XLSX from 'xlsx'
import api from '../services/api'

export default function UploadPreview() {
  const [rows, setRows] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const toast = useToast()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const data = ev.target?.result
      const wb = XLSX.read(data, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(ws, { defval: null })
      setRows(json as any[])
    }
    reader.readAsArrayBuffer(f)
  }

  async function handleUpload() {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await api.post('/reports/import', fd)
      const data = res.data
      toast({ title: 'Importado', description: `criados: ${data.created}`, status: 'success' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: (err as any).message, status: 'error' })
    }
  }

  return (
    <Box>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
      {rows.length > 0 && (
        <>
          <Table size="sm" mt={4}>
            <Thead>
              <Tr>
                {Object.keys(rows[0]).map(k => <Th key={k}>{k}</Th>)}
              </Tr>
            </Thead>
            <Tbody>
              {rows.slice(0, 10).map((r, i) => (
                <Tr key={i}>
                  {Object.keys(rows[0]).map(k => <Td key={k}>{String(r[k] ?? '')}</Td>)}
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button mt={3} onClick={handleUpload} colorScheme="teal">Enviar</Button>
        </>
      )}
    </Box>
  )
}
