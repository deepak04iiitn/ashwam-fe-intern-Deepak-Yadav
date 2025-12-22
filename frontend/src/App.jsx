import React from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Meals from './pages/Meals'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path='/' element={<Meals />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}