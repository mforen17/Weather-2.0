import './ForecastCard.css'

const ForecastCard = ({ temp, img, day, unitSystem }) => {
  return (
    <div className="forecast-card">
      <div className="forecast-card-temp">
        <h5>
          {Math.round(temp)}°{unitSystem === 'imperial' ? 'F' : 'C'}
        </h5>
      </div>
      <div className="forecast-card-img">
        <img src={`icons/union.png`} alt="union" />
      </div>
      <div className="forecast-card-day">
        <h5>{day}</h5>
      </div>
    </div>
  )
}

export default ForecastCard
