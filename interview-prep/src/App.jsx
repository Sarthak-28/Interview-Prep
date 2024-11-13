import { useState } from 'react'
import './App.css'
import { Outlet, Navigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

function App() {

  const {user, isLoaded, isSignedIn} = useUser();
  
  if(!isSignedIn)
  { return <Navigate to={'/auth/sign-in'}/>
  }
  return (
    <>
      <Outlet/>
    </>
  )
}

export default App
