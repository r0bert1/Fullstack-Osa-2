import React, { useState, useEffect } from 'react'
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
      <p key={person.name}>{person.name} {person.number}</p>
    )
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newRestriction, SetNewRestriction ] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
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
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    } else {
      alert(`${newName} on jo luettelossa`)
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
        <Persons restrictionValue={newRestriction} persons={persons}/>
      </div> 
    </div>
  )

}

export default App
