import React from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'antd/dist/reset.css'; // Import Ant Design styles
import {RootLayout} from './layout/RootLayout'
import {LandingPage} from './pages/LandingPage'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <RootLayout>
        <LandingPage/>
      </RootLayout>
    </div>
  );
}



export default App;
