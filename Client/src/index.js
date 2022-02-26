import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignupPage from "./pages/signup";
import ChangingPassword from "./pages/change-password";
import "./styles/index.css";

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<SignupPage />} />
          <Route exact path="/change_password" element={<ChangingPassword/>} />
        </Routes>
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);