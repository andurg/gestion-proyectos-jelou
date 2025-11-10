import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectDetailPage from './pages/ProjectDetailPage';

function App() {
  return (
    <Routes>
      {/* Publico */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Privado (Protect) */}
      <Route element={<ProtectedRoute />}>        
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />         
      </Route>

    </Routes>
  );
}

export default App;