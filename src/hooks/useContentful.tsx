import { useCallback } from "react";

interface useContentfulI {
  request: (body: { query: string }) => Promise<string>;
}

  // interface BirthdayItem {
  //   name: string
  //   date: string
  // }

  // interface Collection {
  //   items: BirthdayItem
  // }

  // interface BirthdaysCollection {
  //   birthdaysCollection: Collection
  // }

  // interface Data<T> {
  //   data: T
  // }

export const useContentful = (): useContentfulI => {
  const request = useCallback(async (body = null): Promise<string> => {
    const apiUrl = `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}/`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_CDA_TOKEN}`,
    };
    try {
      if (body) {
        body = JSON.stringify(body);
      }
      const response = await fetch(apiUrl, { method: "POST", body, headers }).then(data => data.text())
      return response;
    } catch (e) {
      return '';
    }
  }, []);
  return  {request};
};
