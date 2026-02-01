import './App.css';
import Home from './pages/Home.tsx';
import Layout2 from './components/layout/LayoutAdmin.tsx';
import Users from './pages/Users.tsx';
import Tasks from './pages/Tasks.tsx';
import Teams from './pages/Teams.tsx';
import TeamForm from './components/forms/TeamForm.tsx';
import UserForm from './components/forms/UserForm.tsx';
import NotFound from './pages/NotFound.tsx';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import TaskForm from './components/forms/TaskForm.tsx';
import TaskProjectPage from './pages/TaskProjectPage.tsx';
import Role from './pages/Role.tsx';
import RoleForm from './components/forms/RoleForm.tsx';
import Login from './pages/Login.tsx';
import { AuthProvider, useAuth } from './contexts/authContext.tsx';
import ProtectedRoute from './contexts/ProtectedRoute.tsx';
import UserPassForm from './components/forms/UserPassForm.tsx';
import ProjectTaskManagment from './pages/ProjectTaskManagment.tsx';
import About from './pages/About.tsx';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
//<Route path="/tasks/:idTask" element={<TaskModal visible={modalVisible} onClose={() => setModalVisible(false)} />} />
function AppRoutes() {
  const { isAuthenticated } = useAuth();
//  console.log('isAuthenticated', isAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route element={<ProtectedRoute  allowedRoles={["normalUser"]}/>}>
        <Route path="/" element={<Layout2 />}>
          <Route index element={<Home />} />
          <Route path="users/p/" element={<UserPassForm />} />        
          <Route path="tasks" element={<Tasks />} />      
          <Route path="tasks/new" element={<TaskForm />} />
          <Route path="about" element={<About />} />
          <Route path="users" element={<Users />} />   
          <Route path="users/:userid" element={<UserForm />} />                  
          <Route path="*" element={<NotFound />} />               
          </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin","leader"]}/>}>
        <Route path="/" element={<Layout2 />}>      
          <Route path="users/create" element={<UserForm />} />
          <Route path="teams" element={<Teams />} />
          <Route path="teams/create" element={<TeamForm />} />
          <Route path="teams/:idTeam" element={<TeamForm />} />
          <Route path="users/role" element={<Role />} />
          <Route path="users/role/create" element={<RoleForm />} />
          <Route path="users/role/:name" element={<RoleForm />} />
          <Route path="taskProject" element={<TaskProjectPage />} />    
          <Route path="taskProjectManagment" element={<ProjectTaskManagment />} />    
        </Route>
      </Route>
    </Routes>
  );
}

export default App;