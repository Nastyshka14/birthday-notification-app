import contentful from "contentful-management";

export const postEntry = () => {
  const client = contentful.createClient({
    accessToken: "L482r6IOCJjaooW7x2WDVsyi4XOVy5cHWlFmINREF9w",
  });

  const create = () => {
    client
      .getSpace("g5vcvjt0rgq7")
      .then((space) => space.getEnvironment("master"))
      .then((environment) =>
        environment.createEntryWithId("birthdays", "lolololo", {
          fields: {
            name: {
              "en-US": "hdjksk",
            },
            date: {
              "en-US": "2022-09-23",
            },
          },
        })
      )
      .then((entry) => console.log(entry))
      .catch(console.error);
  };
  return create();
};
postEntry();
