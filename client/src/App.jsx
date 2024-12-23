// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import SiginIn from './pages/SignIn/SignInSignUp'
import SignUp from './pages/SignUp/SignUp'
import TypingEffect from './components/typingEffect'

function App() {

  return (
    <>
      <div>
        <Navbar />
        <TypingEffect />
        <Routes>
          <Route path="/signin" element={<SiginIn />} />
          <Route path="/signup" element={<SignUp />} />

        </Routes>
      </div>
    </>
  )
}

export default App
