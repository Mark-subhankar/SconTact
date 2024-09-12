import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import AuthContext from "./Context/AuthContext";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Sppiner"; // Import Spinner component
import { validateData } from "./validateData"; // Import validateData function
import "./Style/NavStyle.css";

function SignUp() {
  const { registerUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State to track loading status
  const [passwordError, setPasswordError] = useState(""); // State to track password validation error

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [credentialsRegister, setCredentialsRegister] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChangeRegister = (event) => {
    const { name, value } = event.target;
    setCredentialsRegister({ ...credentialsRegister, [name]: value });
  };

  // Register Submit function
  const handleSubmitRegister = async (event) => {
    event.preventDefault();

    // Start loading
    setLoading(true);

    console.log("Form data submitted (Register):", credentialsRegister);
 
    
    // Validate email and password
    const validationError = validateData(
      credentialsRegister.email,
      credentialsRegister.password
    );

    if (validationError) {
      setPasswordError(validationError);
      setLoading(false); // Stop loading on error
      return;
    } else {
      setPasswordError(""); // Clear password error if validation passes
    }

    // fill Empty condition justify
    if (
      !credentialsRegister.name ||
      !credentialsRegister.email ||
      !credentialsRegister.password
    ) {
      toast.error("Please fill out all fields!");
      setLoading(false); // Stop loading on error
      return;
    }

    try {
      // Call registerUser with credentialsRegister
      await registerUser(credentialsRegister);

      // Stop loading on success
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Form onSubmit={handleSubmitRegister} className="me-5 ms-5">
        <h1 style={{fontFamily: "Fugaz One"}} className="text-center mt-5">Welcome to SignUp</h1>
        <h6 className="text-center mt-3">
          We're glad you came to sign up. Please sign up
        </h6>
        <Form.Group className="mb-3 mt-4" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            onChange={handleInputChangeRegister}
            value={credentialsRegister.name}
            name="name"
            type="text"
            placeholder="Enter Name"
          />
        </Form.Group>
        <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={handleInputChangeRegister}
            value={credentialsRegister.email}
            name="email"
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <div className="input-group">
            <Form.Control
              onChange={handleInputChangeRegister}
              value={credentialsRegister.password}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
            />
            <Button
              variant="outline-secondary"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <Eye /> : <EyeSlash />}
            </Button>
          </div>
          {passwordError && (
            <p className="text-danger">{passwordError}</p>
          )}
        </Form.Group>

        {loading ? (
          <Spinner splash="Signing up..." />
        ) : (
          <Button
          id="Btn"
            className="d-grid gap-2 col-6 mx-auto mt-4"
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
        )}

        <p className="text-center mt-5 fs-5">
          Already have an account? <Link style={{color:'black'}} to="/login">Login</Link>{" "}
        </p>
      </Form>
    </>
  );
}

export default SignUp;
