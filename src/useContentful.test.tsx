import { useContentful } from "./useContentful";

const birthdays = [
  { date: "2022-09-02T00:00:00.000+04:00", name: "Nastya's birthday" },
  { date: "2022-09-01T00:00:00.000+04:00", name: "ALesya's birthday" },
  { date: "2022-08-31T00:00:00.000+04:00", name: "Todayyyyy" },
  { date: "2022-08-29T00:00:00.000+04:00", name: "Katya's birthday" },
  { date: "2022-08-29T00:00:00.000+04:00", name: "today new" },
];

test("download data from useContentful", async () => {
  const { getBirthdays } = useContentful();
  await getBirthdays().then((data) => {
    expect(data).toStrictEqual(birthdays);
  });
});
