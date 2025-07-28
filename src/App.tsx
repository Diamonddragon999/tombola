import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SpinPage } from './pages/SpinPage';
import { DisplayPage } from './pages/DisplayPage';
import { AdminPage } from './pages/AdminPage';
import { useEffect } from 'react';
import RazvanPage from './pages/RazvanPage';



function App() {
  useEffect(() => {
    // Initialize game state on app load
    import('./utils/gameState').then(({ getGameState }) => {
      getGameState();
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/spin" replace />} />
        <Route path="/spin" element={<SpinPage />} />
        <Route path="/roata-veche" element={<DisplayPage />} />
        <Route path="/admin/" element={<AdminPage />} />
        <Route path="/display" element={<RazvanPage />} />

      </Routes>
    </Router>
  );
}

export default App;