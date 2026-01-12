import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return(
    <button onClick={async () => {
      const response = await fetch("http://localhost:5002/")
      const data = await response.text()
      console.log(data)
    }}>apasa ma</button>
  )

}

export default App
