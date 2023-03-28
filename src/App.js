import Temp from './Components/Temp'
import ForecastDetails from './Components/ForecastDetails'
import ForecastCard from './Components/ForecastCard'
import Toggle from './Components/Toggle'
import { useState, useEffect, useRef } from 'react'
import { WEATHER_API_URL, GEO_API_URL, API_KEY } from './Api'
import { v4 as uuid } from 'uuid'

const App = () => {
  const [mouseDown, setMouseDown] = useState(false)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecastWeather, setForecastWeather] = useState(null)
  const [unitSystem, setUnitSystem] = useState('imperial')
  const slider = useRef()

  const date = new Date()

  // get the forecast of each day
  const selectedForecast = [1, 9, 17, 25, 33, 39]
  let selectedSliderCounter = 1

  // move the forecast slider to the right
  const handleRightClick = () => {
    slider.current.scrollLeft += 450
  }

  // move the forecast slider by using mouse drag
  const handleMouseMove = (e) => {
    if (mouseDown) {
      slider.current.scrollLeft -= e.movementX
    }
  }

  const fetchWeatherReport = async (lat, lon) => {
    console.log('ran')
    const weatherReport = await fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=${unitSystem}&appid=${API_KEY}`
    )
    const forecastReport = await fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=${unitSystem}&appid=${API_KEY}`
    )

    Promise.all([weatherReport, forecastReport])
      .then(async (response) => {
        const weatherResponse = await response[0].json()
        const forecastResponse = await response[1].json()
        setCurrentWeather(weatherResponse)
        setForecastWeather(forecastResponse)
      })
      .catch((err) => console.log(err))
  }
  console.log(currentWeather, forecastWeather)
  useEffect(() => {
    fetch(
      `${GEO_API_URL}/1.0/direct?q=${'Cambridge'},${'US'}&limit=${1}&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        fetchWeatherReport(data[0].lat, data[0].lon)
      })
  }, [unitSystem])

  const dateFormat = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  })

  const weekDayFormat = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  })

  const timeFormat = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })

  const weekDayShortFormat = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  })

  console.log(unitSystem)
  return (
    <>
      {currentWeather && (
        <div className="container">
          <img src={`icons/cover-img.png`} alt="" className="cover-img" />
          <Toggle
            setUnitSystem={() =>
              setUnitSystem(unitSystem === 'imperial' ? 'metric' : 'imperial')
            }
          />
          <Temp temp={currentWeather.main.temp} unitSystem={unitSystem} />
          <h1 className="date">{dateFormat.format(date)}</h1>
          <div className="day-time">
            <h1>{weekDayFormat.format(date)}</h1>
            <hr className="day-time-div"></hr>
            <h1>{timeFormat.format(date)}</h1>
          </div>
          <ForecastDetails
            wind={currentWeather.wind.speed}
            hum={currentWeather.main.humidity}
            rain={currentWeather.rain}
            unitSystem={unitSystem}
          />
          <div
            className={
              'forecast-card-container ' + (mouseDown ? 'slider-scroll' : '')
            }
            ref={slider}
            onMouseDown={() => setMouseDown(true)}
            onMouseUp={() => setMouseDown(false)}
            onMouseLeave={() => setMouseDown(false)}
            onMouseMove={handleMouseMove}
          >
            {forecastWeather.list.map((hour) => {
              selectedSliderCounter++
              if (selectedForecast.includes(selectedSliderCounter)) {
                return (
                  <ForecastCard
                    key={uuid()}
                    temp={hour.main.temp}
                    img={hour.img}
                    day={weekDayShortFormat.format(new Date(hour.dt_txt))}
                    unitSystem={unitSystem}
                  />
                )
              }
            })}
          </div>
          <img
            src={'icons/right-arrow.png'}
            alt="right-arrow"
            className="right-arrow"
            onClick={handleRightClick}
          />
        </div>
      )}
    </>
  )
}

export default App
