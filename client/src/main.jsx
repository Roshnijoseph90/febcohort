import  {RouterProvider} from "react-router-dom";
import { router } from "./routes/router.jsx";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // Import ReactDOM for rendering
import store  from './redux/store.js'
import { Provider } from 'react-redux'
import App from './App'
import './styles/header.css'


import './styles/Footer.css'
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}> {/* Wrap your app in the Redux Provider */}
      <RouterProvider router={router} /> {/* Wrap the RouterProvider with the Redux Provider */}
     
    </Provider>
  </StrictMode>
);
