import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import EntryPage from './pages/EntryPage';
import SmartHospitalLanding from './pages/Entrypage2';
import AppRoutes from './app/routes/AppRoutes';

function App() {
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
