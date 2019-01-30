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
    : props.persons.filter(person => person.name.toLowerCase().includes(props.restrictionValue))

  return (
    personsToShow.map(person =>
      <div key={person.name}>
        {person.name} {person.number} <button onClick={() => props.clickHandler(person.id)}>poista</button>
      </div> 
    )
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newRestriction, SetNewRestriction ] = useState('')

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
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    } else {
      const selected = persons.find(person => person.name === newName)

      if (window.confirm(`${newName} on jo luettelossa, korvataanko vanha numero uudella?`)) {
        axios
          .put(`http://localhost:3001/persons/${selected.id}`, personObject)
          .then(response => {
            setPersons(persons.map(person => person.id !== selected.id ? person : response.data))
            setNewName('')
            setNewNumber('')
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
      axios
        .delete(`http://localhost:3001/persons/${id}`)
        .then(
          setPersons(persons.filter(person => person.id !== id))
        )
    }
  }

  return (
    <div>
      <h1>Puhelinluettelo</h1>
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
