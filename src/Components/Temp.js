import './Temp.css'

const Temp = ({ temp, unitSystem }) => {
  return (
    <div className="main-temp">
      <div className="display">
        <h1>{Math.round(temp)}</h1>
      </div>
      <div className="temp-system">
        <h1>° {unitSystem === 'imperial' ? 'F' : 'C'}</h1>
      </div>
    </div>
  )
}

export default Temp
