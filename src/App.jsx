import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FileUploadAndAnalyze from './components/FUA'
function App() {
  const [count, setCount] = useState(0)

  return (
   <div>
    <FileUploadAndAnalyze />
   </div>
  )
}

export default App
