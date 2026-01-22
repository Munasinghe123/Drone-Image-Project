import React from 'react'

import Header from './components/Header'

import LandingPage from './pages/LandingPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
