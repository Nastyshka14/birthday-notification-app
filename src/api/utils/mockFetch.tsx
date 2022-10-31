import { fakeData } from './fakeData';

export default async function mockFetch(url: string) {
    if(url === `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}/`) {
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify(fakeData)
    }}
   
    throw new Error(`Unhandled request: ${url}`);        
  }