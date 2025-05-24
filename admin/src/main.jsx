import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Context from './context/Context.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import { ToastContainer, Flip } from 'react-toastify'



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />

  }, {
    path: "*",
    element: "You are at wrong route"

  },
])


createRoot(document.getElementById('root')).render(

  // <StrictMode>
    <Context>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Flip} />
    </Context>
  // </StrictMode>,
)
