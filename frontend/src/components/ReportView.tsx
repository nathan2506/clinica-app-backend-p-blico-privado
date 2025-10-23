import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, Tbody, Tr, Td, Box } from '@chakra-ui/react'
import api from '../services/api'
import ReportTable from './ReportTable'

type Props = {
  isOpen: boolean
  onClose: () => void
  report: any
}

export default function ReportView({ isOpen, onClose, report }: Props) {
  const [showWeekDetails, setShowWeekDetails] = useState(false)
  const [weekReports, setWeekReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [showSelected, setShowSelected] = useState(false)
  const [detailReport, setDetailReport] = useState<any | null>(null)

  if (!report) return null

    async function loadWeekReports() {
    try {
      setLoading(true)
      const start = report.report_date
      // compute end as start + 6 days
      const endDate = new Date(start)
      endDate.setDate(endDate.getDate() + 6)
      const end = endDate.toISOString().slice(0,10)
      const res = await api.get(`/reports?start=${start}&end=${end}&limit=1000`)
      setWeekReports(res.data.data || [])
      setShowWeekDetails(true)
    } catch (err) {
      console.error('erro loadWeekReports', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { setShowWeekDetails(false); setWeekReports([]); onClose() }} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Visualizar Relatório - {report.report_date}</ModalHeader>
        <ModalBody>
          {!showWeekDetails ? (
            <>
              <Table variant="simple">
                <Tbody>
                  <Tr><Td>Data</Td><Td>{report.report_date}</Td></Tr>
                  <Tr><Td>Unidade</Td><Td>{report.unit}</Td></Tr>
                  <Tr><Td>Total atendimentos</Td><Td>{report.total_atendimentos}</Td></Tr>
                  <Tr><Td>Total indicações</Td><Td>{report.total_indicacoes}</Td></Tr>
                  <Tr><Td>Total avaliações</Td><Td>{report.total_avaliacoes}</Td></Tr>
                  <Tr><Td>Total avaliações convertidas</Td><Td>{report.total_avaliacoes_convertidas}</Td></Tr>
                  <Tr><Td>Total reavaliações</Td><Td>{report.total_reavaliacoes}</Td></Tr>
                  <Tr><Td>Total reavaliações convertidas</Td><Td>{report.total_reavaliacoes_convertidas}</Td></Tr>
                  <Tr><Td>Total agendamentos dia</Td><Td>{report.total_agendamentos_dia}</Td></Tr>
                  <Tr><Td>Total agendamentos comparecidos</Td><Td>{report.total_agendamentos_comparecidos}</Td></Tr>
                  <Tr><Td>Total tours</Td><Td>{report.total_tours}</Td></Tr>
                  <Tr><Td>Contratos recorrência</Td><Td>{report.contratos_recorrencia}</Td></Tr>
                  <Tr><Td>Quitação carne (valor)</Td><Td>{report.quitacao_carne_valor}</Td></Tr>
                  <Tr><Td>Ortodontia manutenções</Td><Td>{report.ortodontia_manutencoes}</Td></Tr>
                  <Tr><Td>Ortodontia convertidos recorrência</Td><Td>{report.ortodontia_convertidos_recorrencia}</Td></Tr>
                  <Tr><Td>Vendas planos (valor)</Td><Td>{report.vendas_planos_valor}</Td></Tr>
                  <Tr><Td>Renegociações qtd</Td><Td>{report.renegociacoes_qtd}</Td></Tr>
                  <Tr><Td>Renegociações valor</Td><Td>{report.renegociacoes_valor}</Td></Tr>
                  <Tr><Td>Contas recebidas</Td><Td>{report.contas_recebidas}</Td></Tr>
                </Tbody>
              </Table>
              <Box mt={4}>
                {report.unit === 'Agregado semanal' && (
                  <Button colorScheme="blue" isLoading={loading} onClick={loadWeekReports}>Ver relatórios da semana</Button>
                )}
              </Box>
            </>
          ) : (
            <>
              <Box mb={3} display="flex" gap={3} alignItems="center">
                <Button size="sm" onClick={() => setShowWeekDetails(false)}>Voltar</Button>
                <Button size="sm" colorScheme="green" onClick={() => { setShowSelected(true) }} isDisabled={selectedIds.size === 0}>Visualizar selecionados</Button>
                <Button size="sm" variant="ghost" onClick={() => { setSelectedIds(new Set()); setShowSelected(false) }}>Limpar seleção</Button>
              </Box>

              {/* Lista com checkboxes */}
              <Table variant="simple">
                <Tbody>
                  <Tr>
                    <Td></Td>
                    <Td fontWeight="bold">Data</Td>
                    <Td fontWeight="bold">Unidade</Td>
                    <Td fontWeight="bold">Atendimentos</Td>
                    <Td fontWeight="bold">Ações</Td>
                  </Tr>
                  {weekReports.map((r: any) => (
                    <Tr key={r.id}>
                      <Td>
                        <input type="checkbox" checked={selectedIds.has(r.id)} onChange={(e) => {
                          const copy = new Set(Array.from(selectedIds))
                          if (e.target.checked) copy.add(r.id)
                          else copy.delete(r.id)
                          setSelectedIds(copy)
                        }} />
                      </Td>
                      <Td>{r.report_date}</Td>
                      <Td>{r.unit}</Td>
                      <Td>{r.total_atendimentos}</Td>
                      <Td>
                        <Button size="sm" onClick={() => setDetailReport(r)}>Visualizar</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {showSelected && (
                <Box mt={4} borderTopWidth={1} pt={3}>
                  <Box mb={2} fontWeight="bold">Relatórios selecionados</Box>
                  <ReportTable data={weekReports.filter(w => selectedIds.has(w.id))} onView={(r:any)=>setDetailReport(r)} onEdit={() => {}} onDelete={() => {}} />
                </Box>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => { setShowWeekDetails(false); setWeekReports([]); onClose() }}>Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
