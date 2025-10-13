import React, { useEffect, useState } from 'react'
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, Heading, Button, Flex } from '@chakra-ui/react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/reportStats')
        setStats(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Dashboard</Heading>
        <Button colorScheme="red" size="sm" onClick={async () => {
          await logout()
          navigate('/login')
        }}>Sair</Button>
      </Flex>
      {(!user || user.role !== 'clinica') && (
        <SimpleGrid columns={[1, 2, 4]} spacing={4}>
          <Stat>
            <StatLabel>Total atendimentos</StatLabel>
            <StatNumber>{stats ? stats.total_atendimentos || 0 : '—'}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total vendas (R$)</StatLabel>
            <StatNumber>{stats ? stats.vendas_planos_valor || 0 : '—'}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Conversão avaliações</StatLabel>
            <StatNumber>{stats ? stats.taxa_conversao_avaliacoes || '—' : '—'}</StatNumber>
          </Stat>
        </SimpleGrid>
      )}
    </Box>
  )
}
