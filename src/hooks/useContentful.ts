import { useCallback } from 'react'
import { message } from 'antd'
import { IUseContentful } from 'src/domain/types/Birthday'

const showMessage = (msg: string) => {
  if (typeof msg === 'string') {
    message.error(msg)
  }
}

export const useContentful = (): IUseContentful => {
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
      showMessage(error.message)
      return error
    }
  }, [])
  return { request }
}
