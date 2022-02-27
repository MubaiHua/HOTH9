import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignupPage from "./pages/signup";
import ChangingPassword from "./pages/change-password";
import SellPage from "./pages/sell"; 
import BuyPage from "./pages/buy"; 

import "./styles/index.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<SignupPage />} />
          <Route exact path="/change_password" element={<ChangingPassword/>} />
          <Route exact path="/sell" element={<SellPage />} />
          <Route exact path="/buy" element={<BuyPage />} />
        </Routes>
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);