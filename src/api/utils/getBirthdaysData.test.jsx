import { render, screen, waitFor, renderHook } from '@testing-library/react'
import { getBirthdaysData } from './getBirthdaysData'
import App from 'src/App'
import mockFetch from './mockFetch'

beforeEach(() => {
  return jest.spyOn(window, 'fetch').mockImplementation(mockFetch)
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('getBirthdaysData', () => {
  test('App render with fetch', async () => {
    render(<App />)
    waitFor(() => {
      expect(screen.getByText('Siarhei birthday')).toBeInTheDocument()
    })
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  
  test('fetch', async () => {
    const fetchMock = jest.spyOn(window, 'fetch').mockImplementation(mockFetch)
    const { result } = renderHook(() => getBirthdaysData())
    console.log('result', result)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
