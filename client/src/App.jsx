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
export default App
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import {routes} from "./routes/routes"

function App() {

  return (
    <>
      <div>
        <Navbar />
        <TypingEffect />
        <Routes>
          <Route path="/signin" element={<SiginIn />} />
          <Route path="/signup" element={<SignUp />} />
          <RouterProvider router={router}/>

        </Routes>
      </div>
    </>
  )
}




