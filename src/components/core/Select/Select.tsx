export const Select = ({
  value,
  data,
  onChange,
}: {
  value: string
  data: Array<string>
  onChange
}): JSX.Element => {
  const handleOnChange = (e) => {
    onChange(e)
  }

  return (
    <select value={value} onChange={handleOnChange}>
      <option value="" disabled selected>Select event type</option>
      {data.map((item: string) => (
        <option value={item} key={item}>
          {item}
        </option>
      ))}
    </select>
  )
}
