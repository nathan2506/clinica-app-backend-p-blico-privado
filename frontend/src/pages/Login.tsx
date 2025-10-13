import React, { useState } from 'react'
import { Box, Button, Input, Heading, VStack, FormControl, FormLabel } from '@chakra-ui/react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Erro no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="md" mx="auto" mt="20">
      <Heading mb={6}>Clinica Dashboard - Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input name="email" value={email} onChange={e => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Senha</FormLabel>
            <Input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="teal" isLoading={loading}>Entrar</Button>
        </VStack>
      </form>
    </Box>
  )
}
