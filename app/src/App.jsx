import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Drawer from './components/Drawer';
import BillsPage from './pages/BillsPage';
import GraphsPage from './pages/GraphsPage';

function App() {
  return (
    <Router>
      <Drawer>
        <Routes>
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/graphs" element={<GraphsPage />} />
        </Routes>
      </Drawer>
    </Router>
  );
}

export default App;
