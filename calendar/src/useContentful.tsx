interface BirthdayItem {
  name: string;
  date: string;
}

const query = `
{
  birthdaysCollection {
    items {
      name,
      date,
    }
  }
}`;

export const useContentful = () => {
  const getBirthdays = async (): Promise<BirthdayItem[]> => {
    try {
      return fetch(
        `https://graphql.contentful.com/content/v1/spaces/g5vcvjt0rgq7/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer L482r6IOCJjaooW7x2WDVsyi4XOVy5cHWlFmINREF9w",
          },
          body: JSON.stringify({ query }),
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
      reportError({ message: error.message });
    }
  };
  return { getBirthdays };
};
