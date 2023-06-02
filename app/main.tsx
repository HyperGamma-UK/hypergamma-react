import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes
} from "react-router-dom";

import Root from "./routes/dashboard/dashboard";
import ErrorPage from "./routes/404";
import Settings from './routes/settings/layout';
import Devices from './routes/devices';
import { UserNav } from './components/user-nav';
import { MainNav } from './components/main-nav';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "devices",
    element: <Devices />
  },
  {
    path: "settings",
    element: <Settings />
  }
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <span className="font-semibold text-xl tracking-tight">Hypergamma</span>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <Routes>
        <Route path='/' element={<Root />} errorElement={<ErrorPage />}/>
        <Route path='/devices' element={<Devices />}/>
        <Route path='/settings' element={<Settings />}/>
      </Routes>
    </BrowserRouter>
    {/* <RouterProvider router={router} /> */}
  </React.StrictMode>,
)
