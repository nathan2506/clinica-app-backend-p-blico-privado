import React, { useState, useEffect } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, useToast } from '@chakra-ui/react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  initial?: any
}

export default function ReportForm({ isOpen, onClose, onSaved, initial }: Props) {
  const defaultForm = {
    report_date: '',
    unit: '',
    total_atendimentos: 0,
    total_indicacoes: 0,
    total_avaliacoes: 0,
    total_avaliacoes_convertidas: 0,
    total_reavaliacoes: 0,
    total_reavaliacoes_convertidas: 0,
    total_agendamentos_dia: 0,
    total_agendamentos_comparecidos: 0,
    total_tours: 0,
    contratos_recorrencia: 0,
    quitacao_carne_valor: 0,
    ortodontia_manutencoes: 0,
    ortodontia_convertidos_recorrencia: 0,
    vendas_planos_valor: 0,
    renegociacoes_qtd: 0,
    renegociacoes_valor: 0,
    contas_recebidas: 0
  }

  const [form, setForm] = useState<any>(initial || defaultForm)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { user } = useAuth()

  useEffect(() => setForm(initial || defaultForm), [initial])

  async function handleSave() {
    setLoading(true)
    try {
      // simple client-side validation
      if (!form.report_date) return toast({ title: 'Data é obrigatória', status: 'error' })
      if (!form.unit) return toast({ title: 'Unidade é obrigatória', status: 'error' })

      const method = initial ? 'put' : 'post'
      const url = initial ? `/reports/${initial.id}` : '/reports'
      // ensure numeric fields are numbers
      const payload = { ...form }
      Object.keys(payload).forEach(k => {
        if (typeof payload[k] === 'string') {
          const s = payload[k] as string
          if (s.match(/^\d+(\.\d+)?$/)) payload[k] = Number(s)
        }
      })
      await api[method](url, payload)
      toast({ title: 'Salvo', status: 'success' })
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
      toast({ title: 'Erro', description: (err as any).message, status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initial ? 'Editar Relatório' : 'Novo Relatório'}</ModalHeader>
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Data</FormLabel>
            <Input aria-label="Data" type="date" value={form.report_date || ''} onChange={e => setForm({ ...form, report_date: e.target.value })} />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Unidade</FormLabel>
            <Input aria-label="Unidade" value={form.unit || ''} onChange={e => setForm({ ...form, unit: e.target.value })} />
          </FormControl>

          {/* Campos na ordem solicitada */}
          <FormControl mb={3}>
            <FormLabel>Total de atendimentos</FormLabel>
            <NumberInput min={0} value={form.total_atendimentos || 0} onChange={(v) => setForm({ ...form, total_atendimentos: Number(v) })}>
              <NumberInputField aria-label="Total de atendimentos" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total de indicações</FormLabel>
            <NumberInput min={0} value={form.total_indicacoes || 0} onChange={(v) => setForm({ ...form, total_indicacoes: Number(v) })}>
              <NumberInputField aria-label="Total de indicações" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total de avaliações</FormLabel>
            <NumberInput min={0} value={form.total_avaliacoes || 0} onChange={(v) => setForm({ ...form, total_avaliacoes: Number(v) })}>
              <NumberInputField aria-label="Total de avaliações" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total de avaliações convertidas</FormLabel>
            <NumberInput min={0} value={form.total_avaliacoes_convertidas || 0} onChange={(v) => setForm({ ...form, total_avaliacoes_convertidas: Number(v) })}>
              <NumberInputField aria-label="Total de avaliações convertidas" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total de reavaliações</FormLabel>
            <NumberInput min={0} value={form.total_reavaliacoes || 0} onChange={(v) => setForm({ ...form, total_reavaliacoes: Number(v) })}>
              <NumberInputField aria-label="Total de reavaliações" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total de reavaliações convertidas</FormLabel>
            <NumberInput min={0} value={form.total_reavaliacoes_convertidas || 0} onChange={(v) => setForm({ ...form, total_reavaliacoes_convertidas: Number(v) })}>
              <NumberInputField aria-label="Total de reavaliações convertidas" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total de agendamentos para o dia</FormLabel>
            <NumberInput min={0} value={form.total_agendamentos_dia || 0} onChange={(v) => setForm({ ...form, total_agendamentos_dia: Number(v) })}>
              <NumberInputField aria-label="Total de agendamentos para o dia" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total de agendamentos comparecidos no dia</FormLabel>
            <NumberInput min={0} value={form.total_agendamentos_comparecidos || 0} onChange={(v) => setForm({ ...form, total_agendamentos_comparecidos: Number(v) })}>
              <NumberInputField aria-label="Total de agendamentos comparecidos no dia" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total de tours</FormLabel>
            <NumberInput min={0} value={form.total_tours || 0} onChange={(v) => setForm({ ...form, total_tours: Number(v) })}>
              <NumberInputField aria-label="Total de tours" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Contratos convertidos para recorrência</FormLabel>
            <NumberInput min={0} value={form.contratos_recorrencia || 0} onChange={(v) => setForm({ ...form, contratos_recorrencia: Number(v) })}>
              <NumberInputField aria-label="Contratos convertidos para recorrência" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Quitação de carne (valor)</FormLabel>
            <NumberInput precision={2} min={0} value={form.quitacao_carne_valor || 0} onChange={(v) => setForm({ ...form, quitacao_carne_valor: Number(v) })} step={0.01}>
              <NumberInputField aria-label="Quitação de carne (valor)" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Ortodontia - total de manutenções</FormLabel>
            <NumberInput min={0} value={form.ortodontia_manutencoes || 0} onChange={(v) => setForm({ ...form, ortodontia_manutencoes: Number(v) })}>
              <NumberInputField aria-label="Ortodontia - total de manutenções" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Ortodontia - total convertidos para recorrência</FormLabel>
            <NumberInput min={0} value={form.ortodontia_convertidos_recorrencia || 0} onChange={(v) => setForm({ ...form, ortodontia_convertidos_recorrencia: Number(v) })}>
              <NumberInputField aria-label="Ortodontia - total convertidos para recorrência" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Total de vendas para planos de saúde (valor)</FormLabel>
            <NumberInput precision={2} min={0} value={form.vendas_planos_valor || 0} onChange={(v) => setForm({ ...form, vendas_planos_valor: Number(v) })} step={0.01}>
              <NumberInputField aria-label="Total de vendas para planos de saúde (valor)" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Renegociações - pasta vermelha (quantidade)</FormLabel>
            <NumberInput min={0} value={form.renegociacoes_qtd || 0} onChange={(v) => setForm({ ...form, renegociacoes_qtd: Number(v) })}>
              <NumberInputField aria-label="Renegociações - pasta vermelha (quantidade)" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Renegociações - pasta vermelha (valor)</FormLabel>
            <NumberInput precision={2} min={0} value={form.renegociacoes_valor || 0} onChange={(v) => setForm({ ...form, renegociacoes_valor: Number(v) })} step={0.01}>
              <NumberInputField aria-label="Renegociações - pasta vermelha (valor)" />
            </NumberInput>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Contas a receber - recebidas (valor)</FormLabel>
            <NumberInput precision={2} min={0} value={form.contas_recebidas || 0} onChange={(v) => setForm({ ...form, contas_recebidas: Number(v) })} step={0.01}>
              <NumberInputField aria-label="Contas a receber - recebidas (valor)" />
            </NumberInput>
          </FormControl>
        </ModalBody>
        <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="teal" onClick={handleSave} isLoading={loading} isDisabled={!!initial && user && user.role === 'clinica'}>{initial ? 'Salvar' : 'Criar'}</Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
