export const InputDate = ({ value, label, name, onChange }) => {
  const handleOnChange = (e) => onChange(e)

  return (
    <div>
      <input type='date' value={value} name={name} onChange={handleOnChange}/>
      <label htmlFor={name}>{label}:</label>
    </div>
  )
}
