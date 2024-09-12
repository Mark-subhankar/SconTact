import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import AuthContext from "./Context/AuthContext";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Sppiner";
import "./Style/NavStyle.css";

function Login() {
  const [loading, setLoading] = useState(false); // State to track loading status

  const { loginUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [credentialsLogin, setCredentialsLogin] = useState({
    email: "",
    password: "",
  });

  const handleInputChangeLogin = (event) => {
    const { name, value } = event.target;
    setCredentialsLogin({ ...credentialsLogin, [name]: value });
  };

  // Login Submit function
  const handleSubmitLogin = async (event) => {
    event.preventDefault();

    // Start loading
    setLoading(true);

    // toast.success("Logged in successfully");

    console.log("Form data submitted (Login):", credentialsLogin);


    // fill Empty condition justify
    if (!credentialsLogin.email || !credentialsLogin.password) {
      toast.error("Please fill out all fields!");
      setLoading(false); // Stop loading on error
      return;
    }

    try {
      // Call loginUser with credentialsLogin
      await loginUser(credentialsLogin);

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
      <Form onSubmit={handleSubmitLogin} className="me-5 ms-5">
        <h1 style={{fontFamily: "Fugaz One"}} className="text-center mt-5">Welcome Back, Log In</h1>
        <h6 className="text-center mt-3">
          Hi, we are glad you are back. Please login.
        </h6>
        <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={handleInputChangeLogin}
            value={credentialsLogin.email}
            name="email"
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <div className="input-group">
            <Form.Control
              onChange={handleInputChangeLogin}
              value={credentialsLogin.password}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
            />
            <Button
              variant="outline-secondary"
              onClick={togglePasswordVisibility}
              type="button"
            >
              {showPassword ? <Eye /> : <EyeSlash />}
            </Button>
          </div>
        </Form.Group>

        {loading ? (
          <Spinner splash="Logging in..." />
        ) : (

          <>
          <Button
          id="Btn"
            className="d-grid gap-2 col-6 mx-auto mt-4"
            variant="primary"
            type="submit"
          >
            Submit
          </Button>

          </>
        )}
        <p className="text-center mt-5 fs-5">
          Don't have an Account? <Link style={{color:'black'}} to="/signup">Sign Up</Link>{" "}
        </p>
      </Form>
    </>
  );
}

export default Login;
