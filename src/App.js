import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import './App.scss';
import HomePage from './pages/HomePage'
import Footer from "./components/Footer";

function App() {
  return (
      <Router>
        <NavBar />
        <Routes>
          <Route path="/home" element={<HomePage />} />
        </Routes>
      <Footer />
      </Router>
    );
  }
export default App;
