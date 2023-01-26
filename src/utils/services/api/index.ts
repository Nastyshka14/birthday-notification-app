import { DataFromServer } from '@domain/types'

const getData = async (query: string): Promise<DataFromServer> | null => {
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}/`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.REACT_APP_CDA_TOKEN}`,
  }

  try {
    const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify({ query }), headers })
    const responseText = await response.text()
    const responseAsJSON: DataFromServer = JSON.parse(responseText)
    const responseStatus = response.status

    if (responseStatus !== 200) {
      console.error('no data from the server...')
      return null
    } else {
      return responseAsJSON
    }
  } catch (error) {
    console.error(error);
  }
}

export default getData
