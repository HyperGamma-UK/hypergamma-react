import React from 'react'
import ReactDOM from 'react-dom/client'

import './styles/index.css' //built by esbuild

import commoners from '../commoners.config'
globalThis.commoners = commoners;


import {
  HashRouter, // NOTE: Must use this for Electron compatibility
  Route,
  Routes
} from "react-router-dom";

import Root from "./routes/dashboard/dashboard";
import ErrorPage from "./routes/404";
import Settings from './routes/settings/layout';
import Devices from './routes/devices';
import HyperPlus from './routes/plus';

let root = document.createElement('div');
document.body.insertAdjacentElement('afterbegin', root);

ReactDOM.createRoot(root as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<Root />} errorElement={<ErrorPage />}/>
        <Route path='/devices' element={<Devices />}/>
        <Route path='/plus' element={<HyperPlus />}/>
        <Route path='/settings' element={<Settings />}/>
      </Routes>
    </HashRouter>
    {/* <RouterProvider router={router} /> */}
  </React.StrictMode>,
)
