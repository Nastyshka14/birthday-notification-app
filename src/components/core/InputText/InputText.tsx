export const InputText = ({ value, name, label, onChange }) => {
  const handleOnChange = (e) => {
    onChange && onChange(e)
  }

  return (
    <label>
      {label}:<input type='text' name={name} value={value} onChange={handleOnChange} />
    </label>
  )
}
