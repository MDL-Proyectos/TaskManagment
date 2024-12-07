import { useState } from 'react'
import './App.css'
import Home from './modules/Home.tsx'
import Layout from './modules/Layout.tsx'
import Users from './modules/Users.tsx'
import Tasks from './modules/Tasks.tsx'
import Teams from './modules/Teams.tsx'
import TeamForm from './components/forms/TeamForm.tsx'
import UserForm from './components/forms/UserForm.tsx'
import NotFound from './modules/NotFound.tsx'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import TaskForm from './components/forms/TaskForm.tsx'
import Role from './modules/Role.tsx'
import RoleForm from './components/forms/RoleForm.tsx'

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
            <Route path="/users/role/" element={<Role />} />
            <Route path="/users/:userid" element={<UserForm />} />
            <Route path="/users/role/:name" element={<RoleForm />} />
            <Route path="/users/create" element={<UserForm />} />
            <Route path="/users/role/create" element={<RoleForm />} />
            <Route path="/teams/:idTeam" element={<TeamForm />} />
            <Route path="/tasks/:idTask" element={<TaskForm />} />
            <Route path="*" element={<NotFound />} />            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
