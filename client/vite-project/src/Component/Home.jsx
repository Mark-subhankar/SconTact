import React from "react";
import { Link } from "react-router-dom";
import "./Style/NavStyle.css";


function Home() {
  return (
    <>
      <div className="jumbotron pt-5">
        <h1 style={{fontFamily: "Ribeye Marrow"}} className="display-4 text-center mt-5 ">Welcome to B-Contact online Cloud backup</h1>
        <p style={{ fontFamily: "Kaisei Tokumin",fontSize:'20px'}} className="text-center mt-4 me-5 ms-5">
        Your data's safety is our top priority, and we're here to ensure effortless and worry-free backup solutions. Thanks for trusting us with your valuable information. Let's embark on a journey of data protection together! 🛡️🔒 
        </p>
        <p className="lead">
          <Link
          id="Btn"
            className="btn btn-primary btn-lg d-grid gap-2 col-6 mx-auto mt-4"
            to="/login"
            role="button"
          >
            Get Started
          </Link>
        </p>
      </div>
    </>
  );
}

export default Home;
