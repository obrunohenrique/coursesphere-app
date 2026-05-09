// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Futuras rotas como /dashboard virão aqui */}
      </Routes>
    </Router>
  );
}

export default App;