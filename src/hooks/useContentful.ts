import { useCallback } from 'react'

interface useContentfulI {
  request: (body: { query: string }) => Promise<string>
}

export const useContentful = (): useContentfulI => {
  const request = useCallback(async (body = null): Promise<string> => {
    const apiUrl = `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}/`
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_CDA_TOKEN}`,
    }
    try {
      if (body) {
        body = JSON.stringify(body)
      }
      const response = await fetch(apiUrl, { method: 'POST', body, headers })
      if (!response.ok) {
        throw new Error(response.statusText || 'Something went wrong')
      }
      const data = response.text()
      return data
    } catch (error) {
      return error
    }
  }, [])
  return { request }
}
