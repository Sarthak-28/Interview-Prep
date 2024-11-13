import { StrictMode } from 'react'
import { createRoot} from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SignInPage from './auth/sign-in/index.jsx'
import {ClerkProvider} from '@clerk/clerk-react'
import Home from './dashboard/components/index.jsx'



const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const router= createBrowserRouter([
  {
    element: <App/>,
    children:[
      {
        path:'/',
        element: <Home/>
      }
    ]
  },
  {
    path: '/auth/sign-in',
    element: <SignInPage/>
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)
