import { useState } from 'react'
import './App.css'
import Home from './modules/Home.tsx'
import Layout from './modules/Layout.tsx'
import Users from './modules/Users.tsx'
import Tasks from './modules/Tasks.tsx'
import Teams from './modules/Teams.tsx'
import NotFound from './modules/NotFound.tsx'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="Users" element={<Users />} />
            <Route path="teams" element={<Teams />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
