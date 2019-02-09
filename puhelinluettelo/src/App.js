import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import axios from 'axios'
 
const Filter = (props) => {

  return (
    <div>
      rajaa näytettäviä: <input value={props.value} onChange={props.onChange} />
    </div>
  )
}

const PersonForm = (props) => {

  return (
    <div>
      <form onSubmit={props.clickHandler}>
        <div>
          nimi: <input 
            value={props.nameValue} 
            onChange={props.nameChangeHandler}
          />         
        </div>
        <div>
          numero: <input 
            value={props.numberValue} 
            onChange={props.numberChangeHandler}
          />           
        </div>
        <div>
          <button type="submit">lisää</button>
        </div>
      </form>      
    </div>
  )
}

const Persons = (props) => {

  const personsToShow = (props.restrictionValue === null)
    ? props.persons
    : props.persons.filter(person => person.name.toLowerCase().includes(props.restrictionValue.toLowerCase()))

  return (
    personsToShow.map(person =>
      <div key={person.name}>
        {person.name} {person.number} <button onClick={() => props.clickHandler(person.id)}>poista</button>
      </div> 
    )
  )
}

const Notification = ({ message, error }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const notifStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  
  if (message === null) {
    return null
  }

  if (error) {
    return (
      <div style={errorStyle}>
        {message}
      </div>
    )
  }

  return (
    <div style={notifStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newRestriction, SetNewRestriction ] = useState('')
  const [ message, setMessage] = useState(null)
  const [ error, setError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const names = persons.map(person =>
      person.name
    )

    if (!names.includes(newName)) {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setMessage(`Lisättiin ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })  
        .catch(error => {
          setError(true)
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
            setError(false)
          }, 5000)
        })
    } else {
      const selected = persons.find(person => person.name === newName)

      if (window.confirm(`${newName} on jo luettelossa, korvataanko vanha numero uudella?`)) {
        axios
          .put(`http://localhost:3001/api/persons/${selected.id}`, personObject)
          .then(response => {
            setPersons(persons.map(person => person.id !== selected.id ? person : response.data))
            setMessage(`Henkilön ${selected.name} numero vaihdettu`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setPersons(persons.filter(person => person.id !== selected.id))
            setError(true)
            setMessage(`Henkilö ${selected.name} oli jo poistettu`)
            setTimeout(() => {
              setMessage(null)
              setError(false)
            }, 5000)
          })
      }
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleRestrictionChange = (event) => {
    SetNewRestriction(event.target.value)
  }

  const handleDeletion = (id) => {
    const selected = persons.find(person => person.id === id)

    if (window.confirm(`Poistetaanko ${selected.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage(`${selected.name} poistettu`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })

    }
  }

  return (
    <div>
      <h1>Puhelinluettelo</h1>
      <Notification message={message} error={error} />
      <Filter value={newRestriction} onChange={handleRestrictionChange} />
      <h2>lisää uusi</h2>
      <PersonForm nameValue={newName}
        numberValue={newNumber} 
        nameChangeHandler={handleNameChange}
        numberChangeHandler={handleNumberChange}
        clickHandler={addPerson}
      />
      <h2>Numerot</h2>
      <div>
        <Persons restrictionValue={newRestriction} persons={persons} clickHandler={handleDeletion}/>
      </div> 
    </div>
  )

}

export default App
