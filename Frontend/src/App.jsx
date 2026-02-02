import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import AddImages from './pages/Protected/AddImages'



function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/add-images" element={<AddImages />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
