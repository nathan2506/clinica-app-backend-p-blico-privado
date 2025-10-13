import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import Login from '../Login'
import { BrowserRouter } from 'react-router-dom'

test('renders login form', () => {
  render(<BrowserRouter><Login /></BrowserRouter>)
  const heading = screen.getByText(/Clinica Dashboard - Login/i)
  expect(heading).toBeTruthy()
})
