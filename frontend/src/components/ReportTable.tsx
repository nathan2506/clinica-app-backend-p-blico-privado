import React from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function ReportTable({ data, onEdit, onDelete }: any) {
  const { user } = useAuth()
  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Data</Th>
          <Th>Unidade</Th>
          <Th>Atendimentos</Th>
          <Th>Ações</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((r: any) => (
          <Tr key={r.id}>
            <Td>{r.report_date}</Td>
            <Td>{r.unit}</Td>
            <Td>{r.total_atendimentos}</Td>
            <Td>
              {user && user.role !== 'clinica' && (
                <>
                  <Button size="sm" onClick={() => onEdit(r)} mr={2}>Editar</Button>
                  <Button size="sm" colorScheme="red" onClick={async () => {
                    if (!confirm('Confirma deletar?')) return
                    await api.delete(`/reports/${r.id}`)
                    if (onDelete) onDelete(r.id)
                  }}>Deletar</Button>
                </>
              )}
              {user && user.role === 'clinica' && (
                <em style={{ fontSize: 12, color: '#666' }}>Somente criação</em>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
