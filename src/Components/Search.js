import { useState, useRef } from 'react'
import './Search.css'

const Search = ({ handleNewLocationInput }) => {
  const [locationSearch, setLocationSearch] = useState('')
  const [searched, setSearched] = useState(false)
  const inputSearch = useRef()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = () => {
    if (!locationSearch) {
      inputSearch.current.value = 'Type here to search...'
      setLocationSearch('Type here to search...')
      setSearched(!searched)
      return
    } else if (locationSearch === 'Type here to search...') {
      inputSearch.current.value = ''
      setLocationSearch('')
    }
    if (!searched) {
      handleNewLocationInput(locationSearch)
      inputSearch.current.blur()
    }
    setSearched(!searched)
  }

  const handleClear = () => {
    inputSearch.current.value = ''
    setLocationSearch('')
  }

  return (
    <div
      className={'search-container ' + (searched ? 'transparent-bg' : '')}
      onKeyDown={(e) => handleKeyDown(e)}
    >
      {searched && <img src={'icons/location-icon.png'} alt="location-icon" />}
      <input
        ref={inputSearch}
        className={'search-input ' + (searched ? 'input-searched' : '')}
        type={'text'}
        onChange={(e) => setLocationSearch(e.target.value)}
      />
      <div
        className={
          'clear-button ' +
          (locationSearch === '' || searched ? 'clear-dp-none' : '')
        }
        onClick={handleClear}
      >
        <img src={'icons/close-icon.jpg'} alt="clear-icon" width={24} />
      </div>
      <button className={searched ? 'button-bg' : ''} onClick={handleSearch}>
        <img src={'icons/search-icon.png'} alt="search-icon" />
      </button>
    </div>
  )
}

export default Search
