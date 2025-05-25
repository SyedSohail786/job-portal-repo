import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Context from './context/Context.jsx'
import Applied from './pages/Applied.jsx'
import ApplyJob from './pages/ApplyJob.jsx'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/applied-jobs',
    element: <Applied />,
  },
  {
    path: '/apply-jobs/:id',
    element: <ApplyJob/>,
  },
  
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Context>
        <RouterProvider router={router} />
      </Context>
    </ClerkProvider>
  </StrictMode>,
)
