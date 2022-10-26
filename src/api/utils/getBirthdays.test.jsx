import { render, screen, waitFor } from '@testing-library/react'
import App from 'src/App'
import mockFetch from './mockFetch'

beforeEach(() => {
  return jest.spyOn(window, 'fetch').mockImplementation(mockFetch)
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('renders initial heading and form with elements correctly', async () => {
  render(<App />)
  waitFor(() => {
    expect(screen.getByText('Siarhei birthday')).toBeInTheDocument()
  })
  expect(fetch).toHaveBeenCalledTimes(1)
})
