import React from 'react'
import './App.css';
import { CalendarPage } from './components/Calendar/CalendarPage.tsx';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <CalendarPage />
    </BrowserRouter>
  );
}

export default App;
