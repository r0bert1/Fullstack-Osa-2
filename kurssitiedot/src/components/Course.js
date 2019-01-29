import React from 'react'

const Header = props =>
  <h1>{props.course}</h1>

const Total = ({ parts }) => {
  const exercises = parts.map(part => part.exercises)
  const reducer = (accumulator, currentValue) => accumulator + currentValue

  const total = exercises.reduce(reducer)

  return <p>yhteensä {total} tehtävää</p>
}

const Part = ({ part }) =>
  <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => {

  const rows = () => parts.map(part =>
    <Part
      key={part.id}
      part={part}
    />  
  )  

  return (
    <div>
      {rows()}
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course