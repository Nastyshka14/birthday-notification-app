import { GET_BIRTHDAYS } from "./constants";
import { message } from "antd";

interface BirthdayItem {
  name: string;
  date: Date;
}

export const useContentful = () => {

  const getBirthdays = async (): Promise<BirthdayItem[]> => {
    try {
     return fetch(
        `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_CDA_TOKEN}`,
          },
          body: JSON.stringify({ query: GET_BIRTHDAYS }),
        }
      )
        .then((response) => response.json())
        .then(({ data, error }) => {
          if (error) {
            throw new Error("Error fetching birthdays");
          }
          return data.birthdaysCollection.items;
        });
    } catch (error) {
      showMessage(error.message);
    }
  };
  return { getBirthdays };
};

const showMessage = (msg: string) => {
  message.error(msg);
};
