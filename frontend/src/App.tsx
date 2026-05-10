import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import MyCourses from './pages/MyCourses';

// Função simples para proteger rotas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('@CourseSphere:token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/courses" 
          element={
            <PrivateRoute>
              <MyCourses />
            </PrivateRoute>
          } 
/>
      </Routes>
    </Router>
  );
}

export default App;