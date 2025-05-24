import './App.css';
import Home from './modules/Home.tsx';
import Layout from './modules/Layout.tsx';
import Users from './modules/Users.tsx';
import Tasks from './modules/Tasks.tsx';
import Teams from './modules/Teams.tsx';
import TeamForm from './components/forms/TeamForm.tsx';
import UserForm from './components/forms/UserForm.tsx';
import NotFound from './modules/NotFound.tsx';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import TaskForm from './components/forms/TaskForm.tsx';
import Role from './modules/Role.tsx';
import RoleForm from './components/forms/RoleForm.tsx';
import Login from './modules/Login.tsx';
import { AuthProvider, useAuth } from './contexts/authContext.tsx';

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

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated', isAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route element={<Layout />}>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/logout"
          element={isAuthenticated ? <Navigate to="/logout" /> : <Login />}
        />
        <Route
          path="Users"
          element={isAuthenticated ? <Users /> : <Navigate to="/login" />}
        />
        <Route
          path="teams"
          element={isAuthenticated ? <Teams /> : <Navigate to="/login" />}
        />
        <Route
          path="tasks"
          element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />}
        />
        <Route
          path="/users/role/"
          element={isAuthenticated ? <Role /> : <Navigate to="/login" />}
        />
        <Route
          path="/users/:userid"
          element={isAuthenticated ? <UserForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/users/role/:name"
          element={isAuthenticated ? <RoleForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/users/create"
          element={isAuthenticated ? <UserForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/users/role/create"
          element={isAuthenticated ? <RoleForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/teams/:idTeam"
          element={isAuthenticated ? <TeamForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/teams/new"
          element={isAuthenticated ? <TeamForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/tasks/:idTask"
          element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/tasks/new"
          element={isAuthenticated ? <TaskForm /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;