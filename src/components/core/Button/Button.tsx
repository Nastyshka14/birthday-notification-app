export const Button = ({ type, onClick }: { type?: string; onClick }): JSX.Element => (
  <button onClick={() => onClick()}>{type ? type : 'Ok'}</button>
)
