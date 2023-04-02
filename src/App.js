import Temp from './Components/Temp'
import ForecastDetails from './Components/ForecastDetails'
import ForecastCard from './Components/ForecastCard'
import Toggle from './Components/Toggle'
import { useState, useEffect, useRef } from 'react'
import { WEATHER_API_URL, GEO_API_URL, API_KEY } from './Api'
import { v4 as uuid } from 'uuid'
import Search from './Components/Search'

const App = () => {
  const [mouseDown, setMouseDown] = useState(false)
  const [locationInput, setLocationInput] = useState(['Cambridge', 'US'])

  const [currentWeatherF, setCurrentWeatherF] = useState(null)
  const [currentWeatherC, setCurrentWeatherC] = useState(null)
  const [forecastWeatherF, setForecastWeatherF] = useState(null)
  const [forecastWeatherC, setForecastWeatherC] = useState(null)
  const [weatherAndForecast, setWeatherAndForecast] = useState([
    currentWeatherF,
    forecastWeatherF,
  ])

  const [unitSystem, setUnitSystem] = useState('imperial')
  const slider = useRef()

  const date = new Date()

  // get the forecast of each day
  const selectedForecast = [0, 9, 17, 25, 33, 39]
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
  // Change the unit system and the props passed into components
  const handleUnitSystemChange = () => {
    setUnitSystem(unitSystem === 'imperial' ? 'metric' : 'imperial')
    if (unitSystem === 'imperial') {
      setWeatherAndForecast([currentWeatherC, forecastWeatherC])
    } else {
      setWeatherAndForecast([currentWeatherF, forecastWeatherF])
    }
  }

  // Handle new location search
  const handleNewLocationInput = async (location) => {
    const locationSplit = location.split(', ')
    if (locationSplit[1] === '...') {
      setLocationInput([locationSplit[0], locationInput[1]])
      return
    }
    const code = await fetch(
      `https://restcountries.com/v3.1/name/${locationSplit[1]}?fullText=true`
    )
    code
      .json()
      .then((data) => {
        setLocationInput([locationSplit[0], data[0]['cca2']])
      })
      .catch((err) => console.log('ERROR: ', err))
  }

  const fetchWeatherReport = async (lat, lon) => {
    const weatherReportF = await fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=${'imperial'}&appid=${API_KEY}`
    )
    const weatherReportC = await fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=${'metric'}&appid=${API_KEY}`
    )
    const forecastReportF = await fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=${'imperial'}&appid=${API_KEY}`
    )
    const forecastReportC = await fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=${'metric'}&appid=${API_KEY}`
    )

    Promise.all([
      weatherReportF,
      weatherReportC,
      forecastReportF,
      forecastReportC,
    ])
      .then(async (response) => {
        const weatherResponseF = await response[0].json()
        const weatherResponseC = await response[1].json()
        const forecastResponseF = await response[2].json()
        const forecastResponseC = await response[3].json()
        setCurrentWeatherF(weatherResponseF)
        setCurrentWeatherC(weatherResponseC)
        setForecastWeatherF(forecastResponseF)
        setForecastWeatherC(forecastResponseC)
        setWeatherAndForecast([weatherResponseF, forecastResponseF])
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    fetch(
      `${GEO_API_URL}/1.0/direct?q=${locationInput[0]},${
        locationInput[1]
      }&limit=${1}&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        fetchWeatherReport(data[0].lat, data[0].lon)
      })
  }, [locationInput])

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

  return (
    <>
      {currentWeatherC && (
        <div className="container">
          <img src={`icons/cover-img.png`} alt="" className="cover-img" />
          <Toggle setUnitSystem={handleUnitSystemChange} />
          <Temp
            temp={weatherAndForecast[0].main.temp}
            unitSystem={unitSystem}
          />
          <h1 className="date">{dateFormat.format(date)}</h1>
          <div className="day-time">
            <h1>{weekDayFormat.format(date)}</h1>
            <hr className="day-time-div"></hr>
            <h1>{timeFormat.format(date)}</h1>
          </div>
          <ForecastDetails
            wind={weatherAndForecast[0].wind.speed}
            hum={weatherAndForecast[0].main.humidity}
            rain={weatherAndForecast[0].rain}
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
            {weatherAndForecast[1].list.map((hour) => {
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
          <Search handleNewLocationInput={handleNewLocationInput} />
        </div>
      )}
    </>
  )
}

export default App
