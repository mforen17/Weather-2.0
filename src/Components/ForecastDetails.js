import './ForecastDetails.css'

const ForecastDetails = ({ wind, hum, rain, unitSystem }) => {
  console.log(wind, hum, rain)
  return (
    <div className="forecast-details-container">
      <div className="wind">
        <img
          src={`icons/wind-direction-icon.png`}
          alt="wind"
          width={22}
          height={22}
        />
        <p>Wind</p>
        <p>
          {wind.toFixed(1)} {unitSystem === 'imperial' ? 'mph' : 'km/h'}
        </p>
      </div>
      <hr className="forecast-details-container-div1"></hr>
      <div className="hum-rain-container">
        <div className="hum">
          <img src={`icons/hum.png`} alt="humidity" width={22} height={22} />
          <p>Hum</p>
          <p>{hum} %</p>
        </div>
        <hr className="forecast-details-container-div2"></hr>
        <div className="rain">
          <img
            src={`icons/rain-chance.png`}
            alt="rain-chance"
            width={22}
            height={22}
          />
          <p>Rain</p>
          <p>{0} %</p>
        </div>
      </div>
    </div>
  )
}

export default ForecastDetails
