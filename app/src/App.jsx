import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Drawer from './components/Drawer';
import BillsPage from './pages/BillsPage';

function App() {
  return (
    <Router>
      <Drawer>
        <Routes>
          <Route path="/bills" element={<BillsPage />} />
        </Routes>
      </Drawer>
    </Router>
  );
}

export default App;
