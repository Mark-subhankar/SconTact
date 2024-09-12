import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavbarItem from "../src/Component/NavbarItem";
import Home from "../src/Component/Home";
import About from "../src/Component/About";
import Login from "../src/Component/Login";
import SignUp from "../src/Component/SignUp";
import Dashboard from "../src/Component/Dashboard";
import CreateContact from "../src/Component/CreateContact";
import { AuthContextProvider } from "./Component/Context/AuthContext";
import AllContacts from "./Component/AllContacts";

function App() {
  return (
    <>
      <Router>
        <AuthContextProvider>
        <NavbarItem />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-contact" element={<CreateContact />} />
          <Route path="/allcontacts" element={<AllContacts />} />
        </Routes>
        </AuthContextProvider>
      </Router>
    </>
  );
}

export default App;


