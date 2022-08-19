import * as contentful from "contentful";

interface ClientItem {
  space: string;
  accessToken: string;
}
interface EntriesItem {
  content_type: string;
  select: string;
}

interface useContentfulI {
  getBirthdays: () => void;
}

export const useContentful = () => {
  const client = contentful.createClient({
    space: "g5vcvjt0rgq7",
    accessToken: "L482r6IOCJjaooW7x2WDVsyi4XOVy5cHWlFmINREF9w",
  });

  const getBirthdays = async (): Promise<{ name: string; date: string }[]> => {
    try {
      const entries = await client.getEntries({
        content_type: "birthdays",
        select: "fields",
      });

      const sanitizeEntries = entries.items.map((item) => {
        return { ...item.fields };
      });
      console.log(entries);
      return sanitizeEntries;
    } catch (error) {
      console.log("Error fetching birthdays", error);
    }
  };
  return { getBirthdays };
};
