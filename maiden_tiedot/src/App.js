import React, { useState, useEffect } from 'react';
import axios from 'axios'

const BasicInfo = ({ country, weather }) => {

  return(
    <div>
      <h1>{country.name}</h1>
      <p>capital: {country.capital}</p>
      <p>population: {country.population}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => 
          <li key={language.name}>{language.name}</li>
        )}
      </ul>
      <img src={country.flag} alt="flag" width="170" height="120"/>
      <h2>Weather in {country.capital}</h2>
      <p><b>temperature:</b> {weather.current.temp_c} Celsius </p>
      <img src={weather.current.condition.icon} alt="weather icon" width="60" height="60"/>
      <p><b>wind:</b> {weather.current.wind_kph} kph, direction: {weather.current.wind_dir}</p>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [newRestriction, setNewRestriction] = useState('')
  const [show, setShow] = useState('')
  const [url, setUrl] = useState('https://api.apixu.com/v1/current.json?key=56f6d82fa41245f18bc200908192901&q=Paris')
  const [weather, setWeather] = useState('')

  useEffect(() => {
    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
      })
  }, [url])
 
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  
  const handleRestrictionChange = (event) => {
    const selected1 = countries.filter(country => country.name.toLowerCase().includes(event.target.value.toLowerCase()))
    
    if (selected1.length === 1) {
      setUrl(`https://api.apixu.com/v1/current.json?key=56f6d82fa41245f18bc200908192901&q=${selected1[0].capital}`)
    }

    setNewRestriction(event.target.value)
    setShow('')
  }

  const clickHandler = (event) => {
    setShow(event.target.name)

    const selected2 =  countries.find(country => country.name === event.target.name)
    setUrl(`https://api.apixu.com/v1/current.json?key=56f6d82fa41245f18bc200908192901&q=${selected2.capital}`)
  }

  const rows = () => {
    const countriesToShow = countries.filter(country => country.name.toLowerCase().includes(newRestriction.toLowerCase()))

    if (show !== '') {
      const selected = countries.find(country => country.name === show)

      return(
        <div>
          <BasicInfo country={selected} weather={weather}/>
        </div>
      )
    }
    
    if (countriesToShow.length === 1) {
      const country = countriesToShow[0]
      
      return(
        <div>
          <BasicInfo country={country} weather={weather}/>
        </div>
      )
    }

    if (countriesToShow.length < 11) {

      return(
        countriesToShow.map(country =>
          <div key={country.name}>
            {country.name} <button name={country.name} onClick={clickHandler}>show</button>
          </div>
        )
      )
    }

    return(
      <p>Too many matches, specify another filter</p>
    )
  }

  return(
    <div>
      find countries <input value={newRestriction} onChange={handleRestrictionChange} />
      <div>
        {rows()}
      </div>
    </div>
  )
}

export default App;
