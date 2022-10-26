import { renderHook } from '@testing-library/react'
import { getBirthdaysData } from './getBirthdaysData'
import mockFetch from './mockFetch'

describe('getBirthdaysData', () => {
  test('works', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(mockFetch)
    const { result } = renderHook(() => getBirthdaysData())
    // await result.current.getBirthdays()
    console.log('csjhcu', result)
    // expect(fetchMock).toHaveBeenCalledWith(`https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}/`)
  })
})
