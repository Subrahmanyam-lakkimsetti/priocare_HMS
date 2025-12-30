import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import EntryPage from './pages/EntryPage';
import SmartHospitalLanding from './pages/Entrypage2';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path='/new' element={<SmartHospitalLanding />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
