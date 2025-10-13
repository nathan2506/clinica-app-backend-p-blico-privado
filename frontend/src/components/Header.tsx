import React from 'react'
import { Box, Flex, Link as ChakraLink, Button, Text } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const loc = useLocation()

  return (
    <Box bg="gray.50" px={4} py={3} mb={4} boxShadow="sm">
      <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
        <Flex gap={4} align="center">
          <ChakraLink as={Link} to="/" fontWeight={loc.pathname === '/' ? 'bold' : 'normal'}>Dashboard</ChakraLink>
          <ChakraLink as={Link} to="/reports" fontWeight={loc.pathname.startsWith('/reports') ? 'bold' : 'normal'}>Relatórios</ChakraLink>
        </Flex>

        <Flex gap={3} align="center">
          {user && <Text fontSize="sm">{user.name}</Text>}
          <Button size="sm" colorScheme="red" onClick={async () => { await logout() }}>Sair</Button>
        </Flex>
      </Flex>
    </Box>
  )
}
