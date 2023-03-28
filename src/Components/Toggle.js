import './Toggle.css'

const Toggle = ({ setUnitSystem }) => {
  return (
    <label className="toggle-container">
      <h3 className="F">F</h3>
      <h3 className="C">C</h3>
      <input type={'checkbox'} onChange={setUnitSystem} />
      <span className="slider" />
    </label>
  )
}

export default Toggle
