import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, Tbody, Tr, Td } from '@chakra-ui/react'

type Props = {
  isOpen: boolean
  onClose: () => void
  report: any
}

export default function ReportView({ isOpen, onClose, report }: Props) {
  if (!report) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Visualizar Relatório - {report.report_date}</ModalHeader>
        <ModalBody>
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
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Fechar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
